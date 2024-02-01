import Image from "next/image";
const Leftpart = () => {
  return (
    <div className="flex justify-center items-center text-[#fff]">
      <div className="max-md:text-center max-lg:flex flex-col items-center">
        <div>
          <img
            src="/osm-white.png"
            alt="logo"
            className="md:w-52 max-md:w-28"
          />
        </div>
        <div className="max-md:text-[15px] text-[28px] inline-block md:ml-4 font-bold">
          <h3>
            One social media helps you connect and share with the people in your
            life.
          </h3>
        </div>
      </div>
    </div>
  );
};
export default Leftpart;
