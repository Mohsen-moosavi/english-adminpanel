import React, { memo, useState } from 'react'

const SelectSearch = memo(({ options , searchableChild , blurHandler,valueHandler,valueName, children}) => {
    const [search, setSearch] = useState("");
    const [selectedValue, setSelectedValue] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    // فیلتر کردن گزینه‌ها بر اساس ورودی کاربر
    const filteredOptions = options?.filter(option =>
        option[searchableChild].includes(search)
    );

    const handleSelect = (value) => {
        valueHandler(valueName,value.id)
        setSelectedValue(value);
        console.log('value====>' , value)
        setSearch(value[searchableChild]);
        setShowDropdown(false);
    };

    return (
        <div className="form-btn-group relative">
            <label htmlFor="create-sale-input-2" className="form-label">دوره:</label>
            <input
                type="text"
                name='courseId'
                placeholder="دوره مد نظر را انتخاب کنید..."
                className="form-input" id="create-sale-input-2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onBlur={blurHandler}
                onFocus={() => setShowDropdown(true)} />
                {children}

            {showDropdown && (
                <ul className='absolute max-sm:text-sm w-full max-h-[150px] overflow-y-auto rounded-xl m-0 z-30 top-[54px] sm:top-[70px] border-2 border-black bg-[#ddf6ee] list-none'>
                    {filteredOptions?.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <li
                                key={index}
                                onClick={() => handleSelect(option)}
                                className='p-2 cursor-pointer border-b border-[#bbb] hover:bg-[#a0cccc]'
                            >
                                {option[searchableChild]}
                            </li>
                        ))
                    ) : (
                        <li className='p-2 text-gray-600'>موردی یافت نشد</li>
                    )}
                </ul>
            )}
        </div>
    )
})

export default SelectSearch;