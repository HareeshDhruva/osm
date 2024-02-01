import Register from "@/app/components/login/Main";
import Leftpart from "./components/LogoPart";

export default function Home() {
  return (
    <>
      <div className="w-full flex justify-between items-center flex-col h-[100dvh]">
        <div className="flex h-full max-lg:flex-col max-lg:text-center max-md:20 md:m-32 items-center justify-center max-md:flex-col gap-10">
          <div className="w-full">
            <Leftpart />
          </div>
          <div className="w-full">
            <Register />
          </div>
        </div>
      </div>
    </>
  );
}
