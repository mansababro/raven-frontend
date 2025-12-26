import imgScreenshot20251208At1719211 from "figma:asset/37a5968ef2dcf863c3c1c897bca5c306ef43ad72.png";

function Paragraph() {
  return (
    <div className="h-[53.125px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Audiowide:Regular',sans-serif] leading-[53.122px] left-[201.5px] not-italic text-[32px] text-center text-nowrap text-white top-[-0.5px] translate-x-[-50%] uppercase whitespace-pre">Where to go out ?</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[53.125px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Audiowide:Regular',sans-serif] leading-[53.122px] left-[202.11px] not-italic text-[42.84px] text-center text-nowrap text-white top-[-0.5px] translate-x-[-50%] uppercase whitespace-pre">Ask raven</p>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[106.25px] relative shrink-0 w-[402.82px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[106.25px] items-start relative w-[402.82px]">
        <Paragraph />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[17.594px] relative shrink-0 w-[284.852px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[17.594px] relative w-[284.852px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[17.6px] left-0 not-italic text-[16px] text-nowrap text-white top-0 whitespace-pre">YOUR PERSONAL NIGHTLIFE GUIDE</p>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[75.594px] relative shrink-0 w-[284.852px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col h-[75.594px] items-center pb-[58px] pt-0 px-0 relative w-[284.852px]">
        <Paragraph2 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[33px] h-[628px] items-center left-0 px-0 py-[32px] top-1/2 translate-y-[-50%] w-[471.5px]" data-name="Container">
      <Container />
      <div className="h-[291px] relative shrink-0 w-[399px]" data-name="Screenshot 2025-12-08 at 17.19.21 1">
        <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgScreenshot20251208At1719211} />
        <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[291px] w-[399px]" />
      </div>
      <Container1 />
    </div>
  );
}

export default function Container3() {
  return (
    <div className="bg-[#8f7db4] overflow-clip relative rounded-[20px] size-full" data-name="Container">
      <Container2 />
    </div>
  );
}