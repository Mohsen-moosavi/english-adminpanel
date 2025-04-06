import { useFormik } from 'formik'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import DataTable from '../components/modules/DataTable'
import FormErrorMsg from '../components/modules/FormErrorMessag'
import { createNewTag, deleteTag, getTags, setOffset, setSearch, updateTag } from '../redux/features/tagSlice'
import Pagination from '../components/modules/Pagination'
import Searcher from '../components/modules/Searcher'
import Swal from 'sweetalert2'
import { Link } from 'react-router-dom'


export default function Tags() {

    const dispatch = useDispatch()
    const [paginatorChangerFlag, setPaginatorChangerFlag] = useState(false)
    const [searchChangerFlag, setSearchChangerFlag] = useState(false)
    const { tags, tagsCount, search, limit, offset, isLoading } = useSelector(state => state.tagData)

    useEffect(() => {
        dispatch(getTags({ limit, offset: 0,search }))
    }, [])

    const FormValidation = Yup.object({
        name: Yup.string().required("لطفا نام تگ را وارد کنید!.")
    });

    const formik = useFormik({
        initialValues: {
            name: '',
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {
            try {
                dispatch(createNewTag({ name: values.name, limit, offset: 0 }))
                setSearchChangerFlag(prev => !prev)
                setPaginatorChangerFlag(prev => !prev)
                resetForm()
            } catch (error) {
                toast.error(error.response?.data?.message || error.message)
            }
        },
    });

    function paginationHandler(page) {
        dispatch(getTags({ limit, offset: page * limit, search }))
    }

    function deleteTagHandler(id) {
        Swal.fire({
          title: 'آیا از حذف اطمینان دارید؟',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'تایید',
          cancelButtonText: 'لغو',
        }).then(result=>{
          if(result.isConfirmed){
            if (tags.length === 1) {
                dispatch(deleteTag({ id, limit, offset: 0, search }))
                setPaginatorChangerFlag(prev => !prev)
                dispatch(setOffset(0))
            } else {
                dispatch(deleteTag({ id, limit, offset, search }))
            }
          }
        })
    }

    function updateTagHandler(id) {
    Swal.fire({
                inputLabel: 'لطفا نام جدید را وارد کنید.',
                input : 'text',
                confirmButtonText: 'تایید',
              }).then(result=>{
                if(result.isConfirmed && result.value?.trim()){
                    if (tags.length === 1) {
                        dispatch(updateTag({ id, name: result.value?.trim(), limit, offset: 0, search }))
                        setSearchChangerFlag(prev => !prev)
                    } else {
                        dispatch(updateTag({ id, name: result.value?.trim(), limit, offset, search }))
                    }                }
              })
    }



    return (
        <div>
            <h4 className='page-title'>افزودن تگ</h4>
            <form className='mb-4' onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1">
                    <div className="form-btn-group">
                        <label htmlFor="tag-input-1" className="form-label">نام تگ</label>
                        <input
                            type="text"
                            name='name'
                            placeholder="نام تگ را وارد کنید..."
                            className="form-input" id="tag-input-1"
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
                    <input type="submit" disabled={isLoading} value="افزودن تگ"
                        className="form-submit max-md:block max-md:w-full" />
                </div>
            </form>

            <h3 className='page-title'>لیست تگ ها</h3>

            {!tags.length && search === '' ?
                (
                    <div className='text-center'>
                        <h5 className='text-red-400 text-lg'>هنوز موردی وجود ندارد!</h5>
                    </div>
                ) :
                (<>
                    <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1'>
                        <Searcher setPaginatorChangerFlag={setPaginatorChangerFlag} defaultgetterValuesObj={{ limit }} getter={getTags} reset={searchChangerFlag} setSearch={setSearch} setOffset={setOffset} defaultValue={search} />
                    </div>
                    {tags.length ? (
                        <>
                            <DataTable>
                                <thead>
                                    <tr>
                                        <th>شماره</th>
                                        <th>نام</th>
                                        <th>مقاله ها</th>
                                        <th>کتاب ها</th>
                                        <th>دوره ها</th>
                                        <th>تغییر نام</th>
                                        <th>حذف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tags?.map((tag, index) => (
                                        <tr key={index}>
                                            <td>{index + 1 + offset}</td>
                                            <td>{tag.name}</td>
                                            <td>
                                                <Link to={`${tag.id}/tag-articles`} state={{tagName: tag.name}} className="py-1 px-2 rounded-lg text-white bg-blue-500">
                                                    {`${tag.articleCount} (مشاهده)`}
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`${tag.id}/tag-books`} state={{tagName: tag.name}} className="py-1 px-2 rounded-lg text-white bg-blue-500">
                                                    {`${tag.bookCount} (مشاهده)`}
                                                </Link>
                                            </td>
                                            <td>
                                                <Link to={`${tag.id}/tag-courses`} state={{tagName: tag.name}} className="py-1 px-2 rounded-lg text-white bg-blue-500">
                                                    {`${tag.courseCount} (مشاهده)`}
                                                </Link>
                                            </td>
                                            <td>
                                                <button className="py-1 px-2 rounded-lg text-white bg-green-500" onClick={() => updateTagHandler(tag.id)}>
                                                    تغییر
                                                </button>
                                            </td>
                                            <td>
                                                <button className="py-1 px-2 rounded-lg text-white bg-red-500" onClick={() => deleteTagHandler(tag.id)}>
                                                    حذف
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </DataTable>
                            <Pagination itemsCount={tagsCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} setOffset={setOffset} />
                        </>
                    ) : (
                        <div className='text-center my-10'>
                            <h5 className='text-red-400 text-lg'>موردی یافت نشد!</h5>
                        </div>
                    )}

                </>)}
        </div>
    )
}
