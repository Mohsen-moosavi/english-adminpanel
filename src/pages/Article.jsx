import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function Article() {

  const { articles, articlesCount, Search, limit, offset, isLoading } = useSelector(state => state.articleData)

  return (
    <div>
      <h3 className='page-title'>لیست مقاله ها</h3>
      {articles.length ?
        (<>
          <div className='mb-3 grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1'>
          <Link to='create' className='bg-[#6aa6ab] rounded-[10px] text-center text-white hover:bg-main-color hover:text-white p-2'>افزودن مقاله جدید</Link>
            <Search setPaginatorChangerFlag={setPaginatorChangerFlag} sliceName={'tagData'} reset={searchChangerFlag}/>
          </div>
          <DataTable>
            <thead>
              <tr>
                <th>شماره</th>
                <th>نام</th>
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
          <Pagination itemsCount={tagsCount} numberOfitemInEveryPage={limit} paginationHandler={paginationHandler} reseter={paginatorChangerFlag} />
        </>)
        : (
          <>
            <div className='text-center mb-5'>
              <h5 className='text-red-400 text-lg'>هنوز موردی وجود ندارد!</h5>
            </div>
            <div className='mb-3 grid grid-cols-1'>
              <Link to='create' className='bg-[#6aa6ab] rounded-[10px] text-center text-white hover:bg-main-color hover:text-white p-2'>افزودن مقاله جدید</Link>
            </div>
          </>
        )}
    </div>
  )
}
