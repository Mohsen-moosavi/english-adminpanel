import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { getData, getUncompletedCourses } from '../redux/features/consoleSlice'
import userProfile from './../../public/user-profile.png'
import { Link } from 'react-router-dom'

export default function Console() {

    const dispatch = useDispatch()
    const {chartData, unCompletedCourses} = useSelector(state=>state.consoleData)

    useEffect(()=>{
        dispatch(getData({}))
        dispatch(getUncompletedCourses({}))
    },[])

    return (
        <div>
            <h3 className='page-title'>فروش ماهیانه</h3>
            <ResponsiveContainer width={'100%'} height={300}>
                <BarChart data={chartData} margin={{left:20}}>
                    <CartesianGrid strokeDasharray={'3 3'} />
                    <XAxis dataKey='monthName' />
                    <YAxis width={30} tick={{dx:-40}} className='text-[10px]'/>
                    <Tooltip />
                    {/* <Legend /> */}
                    <Bar dataKey={'totalSales'} fill='#82ca9d' />
                </BarChart>
            </ResponsiveContainer>

            <h3 className='page-title mt-5'>کاربران</h3>
            <ResponsiveContainer width={'100%'} height={300}>
                <LineChart data={chartData} margin={{left:40}}>
                    <CartesianGrid strokeDasharray={'3'} />
                    <XAxis dataKey='monthName' />
                    <YAxis width={10} tick={{dx:-35}}  className='text-[10px]' />
                    <Tooltip />
                    {/* <Legend /> */}
                    <Line type={'monotone'} dataKey={'userCount'} stroke='#8884d8' />
                </LineChart>
            </ResponsiveContainer>

            <h3 className='page-title mt-10'>دوره های تکمیل نشده</h3>
            <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-3 gap-y-3'>
                {unCompletedCourses.length ? 
                    unCompletedCourses.map(course=>(
                        <div class="w-[full] rounded-xl overflow-hidden shadow-shadow-low p-2 transition-all hover:-translate-y-2">
                        <Link to="#">
                            <div class="overflow-hidden rounded-xl shadow-shadow-low max-h-[200px]">
                                <img src={course.cover} class="w-full" alt="course img" className='w-full'/>
                            </div>
                        </Link>
                        <div class="flex flex-col justify-start px-3">
                            <div class="relative text-center">
                                <a href="#">
                                    <h4 class="p-3 bg-main-color/20 rounded-xl text-main-color font-bold max-sm:text-sm">{course.name}</h4>
                                </a>
                                <span class="absolute bottom-[-10px] bg-blue-600 rounded-xl px-1 sm:px-2 h-[19px] leading-[18px] sm:h-[25px] sm:leading-[27px] left-[15%] text-white max-sm:text-[10px]">{course.level?.name}</span>
                                <span class="absolute flex gap-x-1 items-center justify-center bottom-[-10px] right-[15%] bg-green-900 rounded-xl px-1 sm:px-2 h-[19px] leading-[17px] sm:h-[25px] sm:leading-[27px] text-white max-sm:text-[10px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="pb-1" viewBox="0 0 16 16">
                                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                    </svg>
                                    <span>{Number(course.score).toFixed(1)}</span>
                                </span>
                            </div>
                            <div class="flex items-center justify-between mt-5">
                                <div class="flex justify-start items-center">
                                    <div class="p-3 bg-green-900 rounded-xl">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#eee" class="bi bi-person-video3" viewBox="0 0 16 16">
                                            <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0m-6 5.7c0 .8.8.8.8.8h6.4s.8 0 .8-.8-.8-3.2-4-3.2-4 2.4-4 3.2"/>
                                            <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.243c.122-.326.295-.668.526-1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7.81c.353.23.656.496.91.783Q16 12.312 16 12V4a2 2 0 0 0-2-2z"/>
                                        </svg>
                                    </div>
                                    <span class="p-1 bg-main-color/20 rounded-l-xl text-main-color max-sm:text-sm">{course.user?.name}</span>
                                </div>
                                <div class="flex flex-col items-end">
                                    {course.offs && course.offs.length && course.offs[0].public ? (
                                        <>
                                        <del class="text-[12px] text-gray-500">{course.price}</del>
                                        <span class="text-end text-custom-dark-blue font-bold leading-[16px] mt-2">{Math.ceil((course.price-(course.price*(course.offs[0].percent/100)))).toLocaleString()}<br/><span
                                                class="font-medium text-gray-400">تومان</span></span>
                                        </>
                                    ) : (
                                        <>
                                        <span class="text-end text-custom-dark-blue font-bold leading-[16px] mt-2">{Number(course.price).toLocaleString()}<br/><span
                                            class="font-medium text-gray-400">تومان</span></span>
                                        </>
                                    ) }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    ))
                    :(null)}

            </div>
        </div>
    )
}
