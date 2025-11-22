import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col pt-8 w-full">
        {/* section 1 */}
        <div className="flex flex-col justify-center items-center h-[44vh] text-white gap-4">
          <span>
            <Image
              className="rounded-full h-32 w-32"
              src="/burger-dance.gif"
              alt="dancing burger"
              width={128}
              height={128}
              unoptimized
            />
          </span>
          <div className="font-bold text-5xl">Buy me a coke! </div>

          <div className="flex w-1/2 justify-center mt-10 relative">
            <input
              type="text"
              placeholder="Search for your creator you wish to support!"
              className="rounded-full p-2 bg-white w-full text-black placeholder:text-black placeholder:italic text-center hover:bg-red-400"
            />
            <Image
              src="/send.png"
              alt="send-icon"
              width={32}
              height={32}
              className="absolute right-5 top-1 cursor-pointer"
            />
          </div>
        </div>

        {/* separator */}
        <div className="bg-white h-1 opacity-15"></div>

        {/* section 2 */}
        <div className="flex flex-col justify-center items-center h-[47vh] text-white gap-2">
          <h1 className="text-white font-bold text-3xl mb-10 text-center">
            Your Fans can buy you a Coke
          </h1>
          <div className="flex items-center gap-44 text-white text-center">
            {/* man */}
            <div className="item flex flex-col items-center gap-5">
              <Image
                src="/man.gif"
                alt="man"
                className="bg-slate-400 w-16 rounded-full p-2"
                width={64}
                height={64}
                unoptimized
              />
              <div className="flex flex-col items-center">
                <p>Fans want to help</p>
                <p>Your Fans will support you</p>
              </div>
            </div>
            {/* coin */}
            <div className="item flex flex-col items-center gap-5">
              <Image
                src="/coin.gif"
                alt="coin"
                className="bg-slate-400 w-16 rounded-full p-2"
                width={64}
                height={64}
                unoptimized
              />
              <div className="flex flex-col items-center">
                <p>Fans want to contribute</p>
                <p>Your Fans are willing to contribute financially</p>
              </div>
            </div>
            {/* collaborate */}
            <div className="item flex flex-col items-center gap-5">
              <Image
                src="/group.gif"
                alt="group"
                className="bg-slate-400 w-16 rounded-full p-2"
                width={64}
                height={64}
                unoptimized
              />
              <div className="flex flex-col items-center">
                <p>Fans want to collaborate</p>
                <p>Fans will collaborate with you!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
