function Paragraph() {
  return (
    <div className="h-[15px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-nowrap text-white top-[-0.5px] tracking-[0.5px] uppercase whitespace-pre">Beta</p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative rounded-[8px] size-full" data-name="Container">
      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
      <div className="size-full">
        <div className="content-stretch flex flex-col items-start pb-0 pt-[4px] px-[12px] relative size-full">
          <Paragraph />
        </div>
      </div>
    </div>
  );
}