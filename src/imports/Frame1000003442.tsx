import imgSpline from "figma:asset/9fc0549a7a506f897a7ef6f62f4fc47e263236f5.png";

export default function Frame() {
  return (
    <div className="relative size-full">
      <div className="absolute h-[201px] left-1/2 top-0 translate-x-[-50%] w-[194px]" data-name="Spline">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgSpline} />
      </div>
      <div className="absolute font-['Doppio_One:Regular',sans-serif] leading-[21px] left-1/2 not-italic text-[#ffaeaf] text-[14px] text-center text-nowrap top-[193px] translate-x-[-50%] whitespace-pre">
        <p className="mb-0">{`Hey! I'm Raven, your AI nightlife guide. `}</p>
        <p>{`Let's get to know each other!`}</p>
      </div>
    </div>
  );
}