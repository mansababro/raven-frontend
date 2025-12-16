function ButtonOnDark() {
  return (
    <div className="bg-[#ffaeaf] content-stretch flex items-center justify-center p-[12px] relative rounded-[8px] shrink-0" data-name="Button on dark">
      <p className="font-['Saira:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`TRY RAVEN (BETA) `}</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[18px] items-center left-[calc(50%+2px)] top-[690px] translate-x-[-50%]">
      <p className="font-['Saira:Regular',sans-serif] leading-[1.1] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">YOUR PERSONAL AI NIGHTLIFE GUIDE</p>
      <ButtonOnDark />
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-[#8f7db4] overflow-clip relative rounded-[20px] size-full">
      <div className="absolute bg-[#d9d9d9] h-[368px] left-0 top-[308px] w-[676px]" data-name="Spline place holder" />
      <Frame1 />
      <div className="absolute font-['Doppio_One:Regular',sans-serif] leading-[1.24] left-1/2 not-italic text-[48px] text-center text-nowrap text-white top-[213px] translate-x-[-50%] uppercase whitespace-pre">
        <p className="mb-0">Where to go out ?</p>
        <p>Ask raven</p>
      </div>
    </div>
  );
}