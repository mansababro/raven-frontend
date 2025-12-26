import svgPaths from "./svg-dl4540wlf2";
import imgFrame1000003437 from "figma:asset/d71a1f0106b82a54e324dce1346501dcbea0e315.png";
import imgScreenshot20251208At1701401 from "figma:asset/982a82d69ba7df8d5831dc6077a11be483b2bf87.png";

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
      <div aria-hidden="true" className="absolute border border-[#ffaeaf] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_8px_0px_rgba(70,95,241,0.1)]" />
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
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-3/4 top-[319px] translate-x-[-50%] w-[358px]" data-name="Input fields">
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
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-3/4 top-[421px] translate-x-[-50%] w-[358px]" data-name="Input fields">
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

function SsoIcon() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SSO Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SSO Icon">
          <path clipRule="evenodd" d={svgPaths.p2c309900} fill="var(--fill-0, #FFAEAF)" fillRule="evenodd" id="Shape" />
          <path clipRule="evenodd" d={svgPaths.p5439c80} fill="var(--fill-0, #34A853)" fillRule="evenodd" id="Shape_2" />
          <path clipRule="evenodd" d={svgPaths.p3b443800} fill="var(--fill-0, #FBBC05)" fillRule="evenodd" id="Shape_3" />
          <path clipRule="evenodd" d={svgPaths.p39a0e280} fill="var(--fill-0, #EA4335)" fillRule="evenodd" id="Shape_4" />
          <g id="Shape_5"></g>
        </g>
      </svg>
    </div>
  );
}

function Buttons1() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex gap-[16px] h-[48px] items-center justify-center left-[calc(66.67%-3px)] px-[20px] py-[10px] rounded-[8px] top-[743px] translate-x-[-50%] w-[112px]" data-name="Buttons">
      <div aria-hidden="true" className="absolute border border-[#ffaeaf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SsoIcon />
    </div>
  );
}

function MsSymbollockupMssymbol() {
  return (
    <div className="absolute left-[2px] size-[21px] top-px" data-name="ms-symbollockup_mssymbol_19 1">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 21">
        <g id="ms-symbollockup_mssymbol_19 1">
          <path d="M10 1H1V10H10V1Z" fill="var(--fill-0, #F25022)" id="Vector" />
          <path d="M10 11H1V20H10V11Z" fill="var(--fill-0, #FFAEAF)" id="Vector_2" />
          <path d="M20 1H11V10H20V1Z" fill="var(--fill-0, #7FBA00)" id="Vector_3" />
          <path d="M20 11H11V20H20V11Z" fill="var(--fill-0, #FFB900)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function SsoIcon1() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SSO Icon">
      <MsSymbollockupMssymbol />
    </div>
  );
}

function Buttons2() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex gap-[16px] h-[48px] items-center justify-center left-[calc(87.5%-58.5px)] px-[20px] py-[10px] rounded-[8px] top-[743px] translate-x-[-50%] w-[113px]" data-name="Buttons">
      <div aria-hidden="true" className="absolute border border-[#ffaeaf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SsoIcon1 />
    </div>
  );
}

function SsoIcon2() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="SSO Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="SSO Icon">
          <path d={svgPaths.pbd8d680} fill="var(--fill-0, white)" id="ï£¿" />
        </g>
      </svg>
    </div>
  );
}

function Buttons3() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex gap-[16px] h-[48px] items-center justify-center left-[calc(75%-1px)] px-[20px] py-[10px] rounded-[8px] top-[743px] translate-x-[-50%] w-[112px]" data-name="Buttons">
      <div aria-hidden="true" className="absolute border border-[#ffaeaf] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SsoIcon2 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="absolute bg-[#121212] left-[calc(75%+0.36px)] top-[711px] translate-x-[-50%] w-[22.721px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="content-stretch flex items-center justify-center px-[12px] py-0 relative w-[22.721px]">
          <div className="flex flex-col font-['Saira:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#b3b3b7] text-[12px] text-nowrap">
            <p className="leading-none whitespace-pre">OR</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute contents left-3/4 top-[711px] translate-x-[-50%]">
      <div className="absolute h-0 left-[calc(66.67%+32px)] top-[717px] w-[176px]">
        <div className="absolute inset-[-0.5px_-0.28%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 177 1">
            <path d="M0.5 0.5H176.5" id="Line 1" stroke="var(--stroke-0, #B3B3B7)" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <Frame6 />
    </div>
  );
}

function Check() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="check">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, #FFAEAF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Constraints() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-[322px]" data-name="Constraints">
      <Check />
      <div className="basis-0 flex flex-col font-['Saira:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-white">
        <p className="leading-none">Password Strength : Weak</p>
      </div>
    </div>
  );
}

function Check1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="check">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, #FFAEAF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Constraints1() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-[322px]" data-name="Constraints">
      <Check1 />
      <div className="basis-0 flex flex-col font-['Saira:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-white">
        <p className="leading-none">Cannot contain your name or email address</p>
      </div>
    </div>
  );
}

function Check2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="check">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, #FFAEAF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Constraints2() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-[322px]" data-name="Constraints">
      <Check2 />
      <div className="basis-0 flex flex-col font-['Saira:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-white">
        <p className="leading-none">At least 8 characters</p>
      </div>
    </div>
  );
}

function Check3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="check">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="check">
          <path d={svgPaths.p39be50} id="Vector" stroke="var(--stroke-0, #FFAEAF)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Constraints3() {
  return (
    <div className="content-stretch flex gap-[9px] items-center relative shrink-0 w-[322px]" data-name="Constraints">
      <Check3 />
      <div className="basis-0 flex flex-col font-['Saira:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-white">
        <p className="leading-none">Contains a number or symbol</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] items-start left-[calc(58.33%+61px)] top-[507px]">
      <Constraints />
      <Constraints1 />
      <Constraints2 />
      <Constraints3 />
    </div>
  );
}

function ButtonOnDark() {
  return (
    <div className="bg-[#ffaeaf] content-stretch flex items-center justify-center p-[12px] relative rounded-[51.575px] shrink-0" data-name="Button on dark">
      <p className="font-['Saira:Medium',sans-serif] font-medium leading-[1.1] relative shrink-0 text-[12px] text-black text-nowrap whitespace-pre" style={{ fontVariationSettings: "'wdth' 100" }}>{`TRY RAVEN (BETA) `}</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[18px] items-center left-[calc(50%+2px)] top-[660px] translate-x-[-50%]">
      <p className="font-['Saira:Regular',sans-serif] leading-[1.1] not-italic relative shrink-0 text-[16px] text-nowrap text-white whitespace-pre">YOUR PERSONAL NIGHTLIFE GUIDE</p>
      <ButtonOnDark />
    </div>
  );
}

function Frame8() {
  return (
    <div className="absolute h-[960px] left-[32px] overflow-clip rounded-[20px] top-[32px] w-[676px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px]">
        <div className="absolute bg-[#e3e3e3] inset-0 rounded-[20px]" />
        <div className="absolute inset-0 overflow-hidden rounded-[20px]">
          <img alt="" className="absolute h-[115.56%] left-[-24.47%] max-w-none top-[-7.78%] w-[124.92%]" src={imgFrame1000003437} />
        </div>
      </div>
      <div className="absolute h-[972px] left-[-46px] top-[-12px] w-[1526px]" data-name="Screenshot 2025-12-08 at 17.01.40 1">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgScreenshot20251208At1701401} />
      </div>
      <Frame9 />
      <div className="absolute font-['Doppio_One:Regular',sans-serif] leading-[1.24] left-1/2 not-italic text-[48px] text-center text-nowrap text-white top-[273px] translate-x-[-50%] uppercase whitespace-pre">
        <p className="mb-0">Where to go out ?</p>
        <p>Ask</p>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="bg-[#121212] relative size-full" data-name="1">
      <TickSquare1 />
      <InputFields />
      <InputFields1 />
      <Tabs />
      <p className="[text-decoration-skip-ink:none] [text-underline-position:from-font] absolute decoration-solid font-['Saira:Regular',sans-serif] leading-[normal] left-[calc(75%+85px)] not-italic text-[#9c9aa5] text-[12px] text-nowrap top-[425px] underline whitespace-pre">Forgot Password?</p>
      <Buttons />
      <Buttons1 />
      <Buttons2 />
      <Buttons3 />
      <Group />
      <p className="absolute font-['DM_Sans:Medium',sans-serif] font-['Saira:Regular',sans-serif] leading-[normal] left-[calc(75%-0.5px)] not-italic text-[10px] text-center text-white top-[953px] translate-x-[-50%] w-[259px]">
        <span className="text-[#9c9aa5]">By signing up to create an account I accept Company’s</span>
        <span>{` T`}</span>
        <span>{`erms of use & Privacy Policy.`}</span>
      </p>
      <Frame7 />
      <Frame8 />
      <p className="absolute font-['Audiowide:Regular',sans-serif] leading-[1.1] left-[calc(58.33%+65px)] not-italic text-[24px] text-nowrap text-white top-[183px] tracking-[-1.08px] uppercase whitespace-pre">Raven</p>
    </div>
  );
}