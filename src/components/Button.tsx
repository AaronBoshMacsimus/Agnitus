export default function Button() {
  return (
    <div className="group pointer-events-auto absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-105 active:scale-95">
      <div className="flex h-12 w-68 -skew-x-30 items-center justify-center border border-white bg-[#111111] p-1.5">
        <div className="relative flex h-full w-full items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 -translate-x-full bg-[#ff4655] transition-transform duration-300 ease-out group-hover:translate-x-0" />
          <span className="relative z-10 skew-x-30 text-lg font-bold tracking-[0.2em] text-[#111111] transition-colors duration-300 group-hover:text-white">
            Explore
          </span>
        </div>
      </div>
    </div>
  )
}
