
export function Loader() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-[#f4f2ee]">
      <h2 className='font-extrabold text-2xl mb-1'>EYLZA .</h2>
      <div className="w-[130px] h-[5px] bg-white relative overflow-hidden z-1 transition-transform duration-300 ease-[ease-in] mx-auto my-0 rounded-sm">
        <div className="h-full w-[68px] absolute translate-x-[-34px] bg-[#0a66c2] animate-[animate-loader_1.5s_ease_infinite] rounded-sm"></div>
      </div>
    </div>
  )
}