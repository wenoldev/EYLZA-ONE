const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="relative w-7 h-7">
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="absolute left-[13px] bottom-0 w-[2px] h-[8px] rounded-[1px] bg-gray-500 animate-[spinner-fade_1s_infinite_linear] origin-[center_-6px]"
            style={{
              animationDelay: `${index * 0.083}s`,
              transform: `rotate(${index * 30}deg)`,
            }}
          />
        ))}
      </div>
      <style>
        {`
          @keyframes spinner-fade {
            0% { background-color: #6b7280; }
            100% { background-color: transparent; }
          }
        `}
      </style>
    </div>
  );
};

export default Loader;