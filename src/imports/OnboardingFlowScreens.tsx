import imgSpline from "figma:asset/9fc0549a7a506f897a7ef6f62f4fc47e263236f5.png";

function Iframe() {
  return <div className="absolute left-[300px] size-[200px] top-0" data-name="Iframe" />;
}

function Paragraph() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Doppio_One:Regular',sans-serif] leading-[21px] left-[128.5px] not-italic text-[#ffaeaf] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%] whitespace-pre">{`Hey! I'm Raven, your nightlife guide. `}</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Doppio_One:Regular',sans-serif] leading-[21px] left-[128.09px] not-italic text-[#ffaeaf] text-[14px] text-center text-nowrap top-[-0.5px] translate-x-[-50%] whitespace-pre">{`Let's get to know each other!`}</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col h-[42px] items-start left-[272.26px] top-[296px] w-[255.484px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-[386px] relative shrink-0 w-full" data-name="Container">
      <Iframe />
      <div className="absolute h-[200px] left-[calc(50%-4px)] top-[99.2px] translate-x-[-50%] w-[193px]" data-name="Spline">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgSpline} />
      </div>
      <Container />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[21px] left-0 top-0 w-[306.242px]" data-name="Paragraph">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[21px] left-0 not-italic text-[14px] text-nowrap text-white top-[0.5px] whitespace-pre">Which music genres do you vibe with the most?</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[42.836px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[42.836px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[21.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Techno</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-0 rounded-[8px] top-0 w-[78.836px]" data-name="Button">
      <Paragraph3 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[92.695px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[92.695px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[46.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Melodic Techno</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[86.84px] rounded-[8px] top-0 w-[128.695px]" data-name="Button">
      <Paragraph4 />
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[38.547px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[38.547px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[19.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">House</p>
      </div>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[223.53px] rounded-[8px] top-0 w-[74.547px]" data-name="Button">
      <Paragraph5 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[69.148px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[69.148px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[35px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Tech House</p>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[306.08px] rounded-[8px] top-0 w-[105.148px]" data-name="Button">
      <Paragraph6 />
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[32.234px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[32.234px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[16.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Disco</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[419.23px] rounded-[8px] top-0 w-[68.234px]" data-name="Button">
      <Paragraph7 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[61.234px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[61.234px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[31px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">DNB/Bass</p>
      </div>
    </div>
  );
}

function Button5() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[495.46px] rounded-[8px] top-0 w-[97.234px]" data-name="Button">
      <Paragraph8 />
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[51.039px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[51.039px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[26px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Ambient</p>
      </div>
    </div>
  );
}

function Button6() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[600.7px] rounded-[8px] top-0 w-[87.039px]" data-name="Button">
      <Paragraph9 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[50.367px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[50.367px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[25.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Dubstep</p>
      </div>
    </div>
  );
}

function Button7() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[695.73px] rounded-[8px] top-0 w-[86.367px]" data-name="Button">
      <Paragraph10 />
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[43.164px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[43.164px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[22px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Garage</p>
      </div>
    </div>
  );
}

function Button8() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-0 rounded-[8px] top-[39.5px] w-[79.164px]" data-name="Button">
      <Paragraph11 />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[30.148px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[30.148px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[15.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Rave</p>
      </div>
    </div>
  );
}

function Button9() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[87.16px] rounded-[8px] top-[39.5px] w-[66.148px]" data-name="Button">
      <Paragraph12 />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[48.211px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[48.211px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[24.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Hip Hop</p>
      </div>
    </div>
  );
}

function Button10() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[161.31px] rounded-[8px] top-[39.5px] w-[84.211px]" data-name="Button">
      <Paragraph13 />
    </div>
  );
}

function Paragraph14() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[44.305px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[44.305px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[22.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Eclectic</p>
      </div>
    </div>
  );
}

function Button11() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[253.52px] rounded-[8px] top-[39.5px] w-[80.305px]" data-name="Button">
      <Paragraph14 />
    </div>
  );
}

function Paragraph15() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-[40.625px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[19.5px] relative w-[40.625px]">
        <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[20.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Trance</p>
      </div>
    </div>
  );
}

function Button12() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex h-[31.5px] items-center justify-center left-[341.83px] rounded-[8px] top-[39.5px] w-[76.625px]" data-name="Button">
      <Paragraph15 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[71px] left-0 top-0 w-[800px]" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
      <Button4 />
      <Button5 />
      <Button6 />
      <Button7 />
      <Button8 />
      <Button9 />
      <Button10 />
      <Button11 />
      <Button12 />
    </div>
  );
}

function Paragraph16() {
  return (
    <div className="absolute h-[21px] left-[14.5px] top-[8px] w-[28.133px]" data-name="Paragraph">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[21px] left-[14.5px] not-italic text-[#9c9aa5] text-[14px] text-center text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">Skip</p>
    </div>
  );
}

function Button13() {
  return (
    <div className="absolute h-[37px] left-0 rounded-[8px] top-[83px] w-[57.133px]" data-name="Button">
      <Paragraph16 />
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[120px] left-0 top-[37px] w-[800px]" data-name="Container">
      <Container2 />
      <Button13 />
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[157px] relative shrink-0 w-full" data-name="Container">
      <Paragraph2 />
      <Container3 />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[64px] h-[607px] items-start left-0 top-[278.8px] w-[800px]" data-name="Container">
      <Container1 />
      <Container4 />
    </div>
  );
}

function Container6() {
  return (
    <div className="h-[909.797px] relative shrink-0 w-[800px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[909.797px] relative w-[800px]">
        <Container5 />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[725px] items-start left-0 overflow-clip pb-0 pl-[135.5px] pr-0 top-[63px] w-[1071px]" data-name="Container">
      <Container6 />
    </div>
  );
}

function Icon() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.83%_16.67%_79.17%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 2">
            <path d="M0.833333 0.833333H14.1667" id="Vector" stroke="var(--stroke-0, #9C9AA5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[16.67%] right-[16.67%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.83px_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 2">
            <path d="M0.833333 0.833333H14.1667" id="Vector" stroke="var(--stroke-0, #9C9AA5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[79.17%_16.67%_20.83%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-0.83px_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 2">
            <path d="M0.833333 0.833333H14.1667" id="Vector" stroke="var(--stroke-0, #9C9AA5)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button14() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-[20px]">
        <Icon />
      </div>
    </div>
  );
}

function Paragraph17() {
  return (
    <div className="basis-0 grow h-[30px] min-h-px min-w-px relative shrink-0" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid h-[30px] relative w-full">
        <p className="absolute font-['Audiowide:Regular',sans-serif] leading-[30px] left-0 not-italic text-[20px] text-nowrap text-white top-0 tracking-[-0.9px] uppercase whitespace-pre">Raven</p>
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[30px] items-center left-[24px] top-[16px] w-[108.234px]" data-name="Container">
      <Button14 />
      <Paragraph17 />
    </div>
  );
}

function Paragraph18() {
  return (
    <div className="absolute h-[15px] left-[12px] top-[2.5px] w-[26.805px]" data-name="Paragraph">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[15px] left-0 not-italic text-[10px] text-nowrap text-white top-[-0.5px] tracking-[0.5px] uppercase whitespace-pre">Beta</p>
    </div>
  );
}

function Container9() {
  return <div className="absolute border border-solid border-white h-[20px] left-0 rounded-[8px] top-0 w-[50.805px]" data-name="Container" />;
}

function Container10() {
  return (
    <div className="absolute h-[20px] left-[996.2px] rounded-[8px] top-[21px] w-[50.805px]" data-name="Container">
      <Paragraph18 />
      <Container9 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[#1f1e1e] border-[#3a3a3a] border-[0px_0px_1px] border-solid h-[63px] left-0 top-0 w-[1071px]" data-name="Container">
      <Container8 />
      <Container10 />
    </div>
  );
}

export default function OnboardingFlowScreens() {
  return (
    <div className="bg-[#121212] relative size-full" data-name="Onboarding Flow Screens">
      <Container7 />
      <Container11 />
    </div>
  );
}