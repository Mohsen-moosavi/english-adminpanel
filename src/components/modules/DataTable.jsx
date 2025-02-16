import React from 'react'

export default function DataTable({children}) {
  return (
    <div className='dataTable max-w-full'>
    <div className='overflow-hidden border-solid border-2 border-main-color rounded-xl'>
        <div className="max-w-full w-full overflow-x-auto">
            <table className="m-0 border-collapse w-full">
                {children}
            </table>
        </div>
    </div>
</div>
  )
}
