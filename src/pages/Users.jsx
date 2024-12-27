import React from 'react'
import DataTable from '../components/modules/DataTable'

export default function Users() {
  return (
    <div>
      <h3 className='page-title'>لیست کاربران</h3>
      <DataTable>
        <thead>
          <tr>
            <th>شماره</th>
            <th>نام</th>
            <th>نام کاربری</th>
            <th>تلفن</th>
            <th>
              <select name="price" className='bg-transparent'>
                <option value="" selected>میزان خرید</option>
                <option value="">کم ترین خرید</option>
                <option value="">بیشترین خرید</option>
              </select>
            </th>
            <th>
            <select name="level" className='bg-transparent'>
                <option value="" selected>سطح</option>
                <option value="">سطح A+</option>
                <option value="">سطح B+</option>
              </select>
            </th>
            <th>
            <select name="score" className='bg-transparent'>
                <option value="" selected>امتیاز</option>
                <option value="">بیشترین امتیاز</option>
                <option value="">کم ترین امتیاز</option>
              </select>
            </th>
            <th>
            <select name="date" className='bg-transparent'>
                <option value="" selected>پیوستن</option>
                <option value="">قدیمی ترین</option>
                <option value="">جدید ترین</option>
              </select>
            </th>
            <th>تغییر نقش</th>
            <th>بن</th>
            <th>حذف</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>سید محسن موسوی ساعی</td>
            <td>mohsen.wsx</td>
            <td>09382646981</td>
            <td>1300000</td>
            <td>B+</td>
            <td>400</td>
            <td>02/11/1403</td>
            <td>
              <button className="py-1 px-2 rounded-lg text-white bg-green-500">
                تغییر
              </button>
            </td>
            <td>
              <button className="py-1 px-2 rounded-lg text-white bg-orange-500">
                بن
              </button>
            </td>
            <td>
              <button className="py-1 px-2 rounded-lg text-white bg-red-500">
                حذف
              </button>
            </td>
          </tr>
        </tbody>
      </DataTable>
    </div>
  )
}
