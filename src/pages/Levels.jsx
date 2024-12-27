import React, { useEffect, useRef, useState } from 'react'
import DataTable from '../components/modules/DataTable'
import { useFormik } from 'formik';
import * as Yup from 'yup'
import { createNewLevel, deleteLevel, getLevels, updateLevel } from '../redux/features/levelSlice';
import FormErrorMsg from '../components/modules/FormErrorMessag';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import swal from 'sweetalert'


export default function Levels() {

    const dispatch = useDispatch()
    const isInitialised = useRef(false)
    const { levels , isLoading } = useSelector(state => state.levelData)

    useEffect(() => {
        if (!isInitialised.current) {
            isInitialised.current = true
            dispatch(getLevels({}))
        }
    }, [])

    const FormValidation = Yup.object({
        name: Yup.string().required("لطفا نام سطح را وارد کنید!.")
    });

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {
            try {
                dispatch(createNewLevel({ name: values.name }))
                resetForm()
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
            }
        },
    });

    function deleteLevelHandler(id) {
        swal({
            title: 'آیا از حذف اطمینان دارید؟',
            icon : 'warning',
            buttons: ['لغو','تایید'],
        }).then(value => {
            if(value){
                dispatch(deleteLevel({ id }))
            }
        })
    }

    function updateLevelHandler(id){
        swal({
            title: 'لطفا نام جدید را وارد کنید.',
            content: 'input',
            buttons: ['لغو','تایید'],
        }).then(value => {
            dispatch(updateLevel({id , name : value}))
        })
    }

    return (
        <div>
            <h4 className='page-title'>افزودن سطح</h4>
            <form className='mb-4' onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1">
                    <div className="form-btn-group">
                        <label htmlFor="level-input-1" className="form-label">نام سطح</label>
                        <input
                            type="text"
                            name='name'
                            placeholder="نام سطح را وارد کنید..."
                            className="form-input" id="level-input-1"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} />
                        {formik.touched.name && formik.errors.name ? (
                            <div className="w-full text-start">
                                <FormErrorMsg msg={formik.errors.name} />
                            </div>
                        ) : null}
                    </div>
                </div>
                <div className="text-strt">
                    <input type="submit" disabled={isLoading} value="افزودن سطح"
                        className="form-submit max-md:block max-md:w-full" />
                </div>
            </form>

            <h3 className='page-title'>لیست سطح ها</h3>
            {levels.length ?
                (<DataTable>
                    <thead>
                        <tr>
                            <th>شماره</th>
                            <th>نام</th>
                            <th>تغییر نام</th>
                            <th>حذف</th>
                        </tr>
                    </thead>
                    <tbody>
                        {levels?.map((level, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{level.name}</td>
                                <td>
                                    <button className="py-1 px-2 rounded-lg text-white bg-green-500" onClick={() => updateLevelHandler(level.id)}>
                                        تغییر
                                    </button>
                                </td>
                                <td>
                                    <button className="py-1 px-2 rounded-lg text-white bg-red-500" onClick={() => deleteLevelHandler(level.id)}>
                                        حذف
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </DataTable>)
                : (
                    <div className='text-center'>
                        <h5 className='text-red-400 text-lg'>هنوز موردی وجود ندارد!</h5>
                    </div>
                )}
        </div>
    )
}
