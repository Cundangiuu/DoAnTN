const Loading = () => {
  return (
    <div className="w-full gap-[2px] grid grid-cols-[1fr_2fr_1fr_2fr_2fr_1fr] mx-auto overflow-hidden justify-center items-center rounded-lg shadow-lg animate-pulse">
      {Array.from(Array(42)).map((_, i) => (
        <div
          key={i}
          className={`w-full h-12 ${
            i < 6
              ? i % 2 === 0
                ? "bg-slate-400"
                : "bg-slate-300"
              : i % 2 === 0
              ? "bg-slate-300"
              : "bg-slate-200"
          }`}
        ></div>
      ))}
    </div>
  );
};

export default Loading;
