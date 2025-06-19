import { useState, useRef, useEffect } from "react";
import { TbSend2 } from "react-icons/tb";

const TextBox = ({sendAnswerHandler , textBoxReseter , isloading}) => {
    const [message, setMessage] = useState("");
    const textareaRef = useRef(null);

    // تغییر ارتفاع خودکار هنگام تایپ
    const handleInputChange = (e) => {
        setMessage(e.target.value);

        // تغییر ارتفاع خودکار
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    };

    // ارسال پیام (فقط برای نمایش در console)
    const handleSend = () => {
        sendAnswerHandler(message)
    };

    useEffect(()=>{
        setMessage('')
    } , [textBoxReseter])

    return (
        <div className="flex items-center w-full border border-main-color/50 px-2 py-2 sm:px-3 rounded-lg bg-white">

            {/* دکمه ارسال */}

            <button
                onClick={handleSend}
                disabled={message.trim() === "" || isloading}
                className={`${
                message.trim() !== ""
                  ? "opacity-80 hover:opacity-100"
                  : "opacity-50 cursor-not-allowed"
              } text-white rounded-full sm:px-2 transition mt-auto`}
            >
                <TbSend2 className='bg-sky-400 rounded-full w-[40px] h-auto p-2' color='#fff' />
            </button>

            {/* Textarea برای تایپ پیام */}
            <textarea
                ref={textareaRef}
                rows="1"
                value={message}
                onChange={handleInputChange}
                placeholder="پاسخ خود را بنویسید..."
                className="flex-grow border-none outline-none max-sm:text-sm resize-none bg-transparent text-sm px-2 max-h-20 sm:max-h-40 overflow-y-auto textbox-textarea"
            />
        </div>
    );
};

export default TextBox;