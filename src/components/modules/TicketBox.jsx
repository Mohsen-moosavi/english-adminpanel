import moment from 'moment-jalaali'
import { FaTrashAlt } from 'react-icons/fa'

export default function TicketBox({ message, isUser, deleteMessageHandler , isloading }) {
    return (
        <div className={`max-w-[80%] w-auto relative border-[3px] border-solid rounded-xl mb-3 ${isUser ? 'border-sky-800 bg-sky-400/10 mr-auto rounded-bl-none' : 'border-main-color bg-green-800/20 ml-auto rounded-br-none'} mb-5`}>
            <div
                className="flex items-center gap-x-2 border-b border-solid border-gray-400 mx-2 py-2">
                <img src={message?.sender?.avatar || "/public/images/user-profile.png"} alt="user"
                    className="rounded-full w-[50px] max-md:w-[30px] bg-green-800/50" />
                <div className="flex flex-col">
                    <span className="text-main-color max-md:text-[12px] font-bold">{message?.sender?.name}</span>
                    <div className='flex items-center gap-x-3'>
                        <span className="text-[12px] max-md:text-[8px] text-gray-500">{moment(message?.created_at).format('jYYYY/jMM/jDD')}</span>
                    </div>
                </div>
                <button className='mr-auto cursor-pointer p-2 text-white rounded-full bg-[#ca6464]' disabled={isloading} onClick={() => deleteMessageHandler(message.id)}>
                    <FaTrashAlt className='h-auto w-[10px] sm:w-[15px]'></FaTrashAlt>
                </button>
            </div>
            <p className="text-gray-700 text-[16px] max-md:text-[12px] my-2 px-2">{message?.message}</p>
        </div>
    )
}
