import svgPaths from "./svg-p6w04fvk13";

function TickSquare() {
  return (
    <div className="absolute inset-[11.46%]" data-name="Tick-Square">
      <div className="absolute inset-[-4.05%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
          <g id="Tick-Square">
            <path clipRule="evenodd" d={svgPaths.p2f8c6200} fillRule="evenodd" id="Stroke-1" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            <path d={svgPaths.p15f065c0} id="Stroke-3" stroke="var(--stroke-0, black)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconlyLightTickSquare() {
  return (
    <div className="absolute contents inset-[11.46%]" data-name="Iconly/Light/Tick-Square">
      <TickSquare />
    </div>
  );
}

function TickSquare1() {
  return (
    <div className="absolute left-[calc(100%+4229.68px)] overflow-clip size-[24px] top-[616.29px]" data-name="Tick Square">
      <IconlyLightTickSquare />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0">
      <p className="font-['Saira:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Email Id</p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#1f1e1e] h-[48px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#ffaeaf] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_8px_0px_rgba(255,174,175,0.2)]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] h-[48px] items-center px-[16px] py-[8px] relative w-full">
          <p className="font-['Saira:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">|</p>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame1 />
    </div>
  );
}

function InputFields() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-3/4 top-[429px] translate-x-[-50%] w-[358px]" data-name="Input fields">
      <Frame />
      <Frame2 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0">
      <p className="font-['Saira:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">Password</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[#1f1e1e] h-[48px] relative rounded-[8px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[#ffaeaf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] h-[48px] items-center px-[16px] py-[8px] relative w-full">
          <p className="font-['Saira:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#9c9aa5] text-[14px] text-nowrap whitespace-pre">Enter Password</p>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
      <Frame4 />
    </div>
  );
}

function InputFields1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-3/4 top-[531px] translate-x-[-50%] w-[358px]" data-name="Input fields">
      <Frame3 />
      <Frame5 />
    </div>
  );
}

function Component1() {
  return (
    <div className="basis-0 bg-[#ffaeaf] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Component 3">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[8px] relative w-full">
          <p className="font-['Saira:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1f1e1e] text-[16px] text-center text-nowrap whitespace-pre">Sign Up</p>
        </div>
      </div>
    </div>
  );
}

function Component2() {
  return (
    <div className="basis-0 bg-[#1f1e1e] grow min-h-px min-w-px relative rounded-[8px] shrink-0" data-name="Component 6">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[20px] py-[8px] relative w-full">
          <p className="font-['Saira:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#9c9aa5] text-[16px] text-center text-nowrap whitespace-pre">Sign In</p>
        </div>
      </div>
    </div>
  );
}

function Tabs() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex items-start left-3/4 p-[4px] rounded-[8px] top-[249px] translate-x-[-50%] w-[358px]" data-name="Tabs">
      <Component1 />
      <Component2 />
    </div>
  );
}

function Buttons() {
  return (
    <div className="absolute bg-[#ffaeaf] content-stretch flex gap-[8px] h-[48px] items-center justify-center left-[calc(75%-0.5px)] px-[20px] py-[10px] rounded-[8px] top-[643px] translate-x-[-50%] w-[357px]" data-name="Buttons">
      <p className="font-['Saira:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-black text-nowrap whitespace-pre">Create Account</p>
    </div>
  );
}

function ButtonOnDark() {
  return (
    <div className="bg-[#ffaeaf] content-stretch flex items-center justify-center p-[12px] relative rounded-[8px] shrink-0" data-name="Button on dark">
      <p className="font-['Saira:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`TRY RAVEN (BETA) `}</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[18px] items-center left-[calc(50%+2px)] top-[660px] translate-x-[-50%]">
      <p className="font-['Saira:Regular',sans-serif] leading-[1.1] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">YOUR PERSONAL AI NIGHTLIFE GUIDE</p>
      <ButtonOnDark />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-[#8f7db4] h-[960px] left-[32px] overflow-clip rounded-[20px] top-[32px] w-[676px]">
      <Frame7 />
      <div className="absolute font-['Doppio_One:Regular',sans-serif] leading-[1.24] left-1/2 not-italic text-[48px] text-center text-nowrap text-white top-[273px] translate-x-[-50%] uppercase whitespace-pre">
        <p className="mb-0">Where to go out ?</p>
        <p>Ask</p>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-[calc(58.33%+65px)] top-[397px]">
      <div className="absolute flex flex-col font-['Saira:Regular',sans-serif] justify-center leading-[0] left-[calc(75%-0.5px)] not-italic text-[#9c9aa5] text-[12px] text-center text-nowrap top-[406.5px] translate-x-[-50%] translate-y-[-50%] uppercase">
        <p className="leading-[normal] whitespace-pre">Or</p>
      </div>
      <div className="absolute h-0 left-[calc(75%+33.69px)] top-[407px] w-[141.315px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 142 1">
            <line id="Line 5" stroke="var(--stroke-0, #9C9AA5)" x2="141.315" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute h-0 left-[calc(58.33%+65px)] top-[407px] w-[141.315px]">
        <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 142 1">
            <line id="Line 6" stroke="var(--stroke-0, #9C9AA5)" x2="141.315" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function FlatColorIconsGoogle() {
  return (
    <div className="absolute h-[24px] left-[calc(58.33%+98.85px)] top-[calc(50%-168px)] translate-y-[-50%] w-[24.549px]" data-name="flat-color-icons:google">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 25 24">
        <g id="flat-color-icons:google">
          <path d={svgPaths.pbd20980} fill="var(--fill-0, #FFC107)" id="Vector" />
          <path d={svgPaths.p145ca200} fill="var(--fill-0, #FF3D00)" id="Vector_2" />
          <path d={svgPaths.p21cf0700} fill="var(--fill-0, #4CAF50)" id="Vector_3" />
          <path d={svgPaths.p59d7180} fill="var(--fill-0, #1976D2)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-[calc(58.33%+61px)] top-[320px]">
      <div className="absolute bg-[#1f1e1e] border border-[#ffaeaf] border-solid h-[48px] left-[calc(58.33%+61px)] rounded-[8px] shadow-[0px_4px_10px_0px_rgba(0,0,0,0.08)] top-[320px] w-[358px]" />
      <div className="absolute flex flex-col font-['Saira:Light',sans-serif] font-light h-[14.25px] justify-center leading-[0] left-3/4 text-[#8c8a94] text-[16px] text-center top-[344.38px] translate-x-[-50%] translate-y-[-50%] w-[163.657px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        <p className="leading-[normal]">Register with Google</p>
      </div>
      <FlatColorIconsGoogle />
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#121212] relative size-full" data-name="2">
      <TickSquare1 />
      <InputFields />
      <InputFields1 />
      <Tabs />
      <Buttons />
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-['Saira:Regular',sans-serif] leading-[normal] left-[calc(75%-0.5px)] not-italic text-[10px] text-center text-white top-[953px] translate-x-[-50%] w-[259px]">
        <span className="text-[#9c9aa5]">By signing up to create an account I accept Company’s</span>
        <span>{` T`}</span>
        <span>{`erms of use & Privacy Policy.`}</span>
      </p>
      <Frame6 />
      <p className="absolute font-['Audiowide:Regular',sans-serif] leading-[1.1] left-[calc(58.33%+65px)] not-italic text-[24px] text-nowrap text-white top-[183px] tracking-[-1.08px] uppercase whitespace-pre">Raven</p>
      <Group />
      <Group1 />
    </div>
  );
}