import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import * as Yup from 'yup'
import FormErrorMsg from '../components/modules/FormErrorMessag';
import SelectSearch from '../components/modules/SelectSearch';
import { useDispatch, useSelector } from 'react-redux';
import { getShortDetailCourses } from '../redux/features/courseSlice';
import { createSaleByAdmin } from '../redux/features/saleSlice';

export default function CreateSaleByAdmin() {

    const { state: locationState } = useLocation()
    const { id } = useParams()
    const navigate = useNavigate();
    const [courses , setCourses] = useState()
    const isInitialised = useRef(false)
    const dispatch = useDispatch(false)
    const {isLoading} = useSelector(state=>state.saleData)

    useEffect(()=>{
        if(!isInitialised.current){
            isInitialised.current = true;
            dispatch(getShortDetailCourses({setCourses}))
        }
    },[])

    const FormValidation = Yup.object({
        price: Yup.number().required("لطفا قیمت پرداخت شده را وارد کنید!"),
        courseId: Yup.number().required("لطفا دوره مد نظر را وارد کنید."),
    });
    const formik = useFormik({
        initialValues: {
            price: '',
            courseId: ''
        },
        validationSchema: FormValidation,
        onSubmit: async (values, { resetForm }) => {
                    swal({
                        title: 'آیا از اضافه کردن دوره برای کاربر، اطمینان دارید؟',
                        icon: 'warning',
                        buttons: ['لغو', 'تایید'],
                    }).then(value => {
                        if (value) {
                            dispatch(createSaleByAdmin({courseId: values.courseId ,userId: id, price: values.price, navigate }))
                        }
                    })
        },
    });



    return (
        <div>
            <h3 className='page-title'><span className='font-medium'>افزودن دوره برای </span>{locationState?.userName}</h3>
            <form className='mb-4' onSubmit={formik.handleSubmit}>

                <SelectSearch options={courses}  searchableChild='name' blurHandler={formik.handleBlur} valueHandler={formik.setFieldValue} valueName='courseId'>
                    {formik.touched.courseId && formik.errors.courseId ? (
                        <div className="w-full text-start">
                            <FormErrorMsg msg={formik.errors.courseId} />
                        </div>
                    ) : null}
                    {console.log('formik.touched.price===>',formik.touched.courseId , formik.values.courseId)}
                </SelectSearch>

                <div className="form-btn-group">
                    <label htmlFor="create-sale-input-1" className="form-label">مبلغ پرداخت شده:</label>
                    <input
                        type="number"
                        name='price'
                        placeholder="مبلغ پرداخت شده را وارد کنید..."
                        className="form-input" id="create-sale-input-1"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur} />
                    {formik.touched.price && formik.errors.price ? (
                        <div className="w-full text-start">
                            <FormErrorMsg msg={formik.errors.price} />
                        </div>
                    ) : null}
                </div>

                <div className="grid md:grid-cols-2 gap-x-2 gap-y-2">
                    <Link to='/articles' className="form-submit !py-2 block w-full text-center !text-black !bg-gray-200 hover:!bg-gray-400">بازگشت</Link>
                    <input type="submit" disabled={isLoading} value={"افزودن دوره"}
                        className="form-submit !py-2 block w-full hover:opacity-70 transition-all" />
                </div>
            </form>
        </div>
    )
}

// const options = [
//     "Apple", "Banana", "Cherry", "Date", "Grape", "Kiwi", "Lemon", "Mango", "Orange", "Pineapple"
//     // لیست کامل گزینه‌ها را اینجا اضافه کنید
// ];







const SearchableSelect = () => {
    const [search, setSearch] = useState("");
    const [selectedValue, setSelectedValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // فیلتر کردن گزینه‌ها بر اساس ورودی کاربر
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (value) => {
        setSelectedValue(value);
        setSearch(value);
        setShowDropdown(false);
    };

    return (
        <div style={{ position: "relative", width: "200px" }}>
            {/* اینپوت جستجو */}
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                placeholder="انتخاب کنید..."
                style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: "5px",
                    border: "1px solid #ccc"
                }}
            />

            {/* نمایش لیست گزینه‌ها در صورت باز بودن دراپ‌داون */}
            {showDropdown && (
                <ul
                    style={{
                        position: "absolute",
                        width: "100%",
                        maxHeight: "150px",
                        overflowY: "auto",
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        listStyle: "none",
                        padding: "5px",
                        margin: "0",
                        zIndex: 1000
                    }}
                >
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(option)}
                                style={{
                                    padding: "8px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #eee"
                                }}
                            >
                                {option}
                            </li>
                        ))
                    ) : (
                        <li style={{ padding: "8px", color: "gray" }}>موردی یافت نشد</li>
                    )}
                </ul>
            )}
        </div>
    );
};