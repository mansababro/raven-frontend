function Paragraph() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[21.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Techno</p>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute bg-[#1f1e1e] content-stretch flex flex-col h-[39.5px] items-start left-0 pb-[2px] pt-[10px] px-[18px] rounded-[8px] top-0 w-[78.836px]" data-name="Button">
      <Paragraph />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[46.5px] not-italic text-[13px] text-center text-nowrap text-white top-[0.5px] translate-x-[-50%] whitespace-pre">Melodic Techno</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.5px] items-start left-[86.84px] pb-[2px] pt-[10px] px-[18px] rounded-[8px] top-0 w-[128.695px]" data-name="Button" style={{ backgroundImage: "linear-gradient(90deg, rgba(143, 125, 180, 0.15) 0%, rgba(143, 125, 180, 0.15) 100%), linear-gradient(90deg, rgb(31, 30, 30) 0%, rgb(31, 30, 30) 100%)" }}>
      <Paragraph1 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[19.5px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[19.5px] left-[19.5px] not-italic text-[#121212] text-[13px] text-center text-nowrap top-[0.5px] translate-x-[-50%] whitespace-pre">House</p>
    </div>
  );
}

function Button2() {
  return (
    <div className="absolute content-stretch flex flex-col h-[39.5px] items-start left-[223.53px] pb-[2px] pt-[10px] px-[18px] rounded-[8px] top-0 w-[74.547px]" data-name="Button" style={{ backgroundImage: "linear-gradient(90deg, rgb(143, 125, 180) 0%, rgb(143, 125, 180) 100%), linear-gradient(90deg, rgb(31, 30, 30) 0%, rgb(31, 30, 30) 100%)" }}>
      <Paragraph2 />
    </div>
  );
}

function Button3() {
  return (
    <div className="absolute h-[37px] left-[2.5px] rounded-[8px] top-[50px] w-[76.133px]" data-name="Button">
      <p className="absolute font-['Saira:Regular',sans-serif] leading-[21px] left-[14.5px] not-italic text-[#9c9aa5] text-[14px] text-center text-nowrap top-[8px] translate-x-[-50%] whitespace-pre">Skip</p>
    </div>
  );
}

export default function Container() {
  return (
    <div className="relative size-full" data-name="Container">
      <Button />
      <Button1 />
      <Button2 />
      <Button3 />
    </div>
  );
}