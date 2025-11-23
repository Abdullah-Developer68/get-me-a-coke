import Image from "next/image";
import CreatorSearch from "@/components/CreatorSearch";

export default function Home() {
  return (
    <>
      <div className="flex flex-col pt-4 md:pt-8 w-full px-4">
        {/* section 1 */}
        <div className="flex flex-col justify-center items-center min-h-[44vh] text-white gap-3 md:gap-4 pb-8">
          <span>
            <Image
              className="rounded-full h-20 w-20 sm:h-28 sm:w-28 md:h-32 md:w-32"
              src="/burger-dance.gif"
              alt="dancing burger"
              width={128}
              height={128}
              unoptimized
            />
          </span>
          <div className="font-bold text-3xl sm:text-4xl md:text-5xl text-center px-4">
            Buy me a coke!
          </div>

          {/* Interactive Search Component */}
          <CreatorSearch />
        </div>

        {/* separator */}
        <div className="bg-white h-1 opacity-15"></div>

        {/* section 2 */}
        <div className="flex flex-col justify-center items-center min-h-[47vh] text-white gap-2 py-8 md:py-0">
          <h1 className="text-white font-bold text-2xl sm:text-3xl mb-6 md:mb-10 text-center px-4">
            Your Fans can buy you a Coke
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 lg:gap-44 text-white text-center w-full max-w-6xl px-4">
            {/* man */}
            <div className="item flex flex-col items-center gap-3 md:gap-5 w-full md:w-auto">
              <Image
                src="/man.gif"
                alt="man"
                className="bg-slate-400 w-14 sm:w-16 rounded-full p-2"
                width={64}
                height={64}
                unoptimized
              />
              <div className="flex flex-col items-center">
                <p className="text-sm sm:text-base font-semibold">
                  Fans want to help
                </p>
                <p className="text-xs sm:text-sm opacity-90">
                  Your Fans will support you
                </p>
              </div>
            </div>
            {/* coin */}
            <div className="item flex flex-col items-center gap-3 md:gap-5 w-full md:w-auto">
              <Image
                src="/coin.gif"
                alt="coin"
                className="bg-slate-400 w-14 sm:w-16 rounded-full p-2"
                width={64}
                height={64}
                unoptimized
              />
              <div className="flex flex-col items-center">
                <p className="text-sm sm:text-base font-semibold">
                  Fans want to contribute
                </p>
                <p className="text-xs sm:text-sm opacity-90">
                  Your Fans are willing to contribute financially
                </p>
              </div>
            </div>
            {/* collaborate */}
            <div className="item flex flex-col items-center gap-3 md:gap-5 w-full md:w-auto">
              <Image
                src="/group.gif"
                alt="group"
                className="bg-slate-400 w-14 sm:w-16 rounded-full p-2"
                width={64}
                height={64}
                unoptimized
              />
              <div className="flex flex-col items-center">
                <p className="text-sm sm:text-base font-semibold">
                  Fans want to collaborate
                </p>
                <p className="text-xs sm:text-sm opacity-90">
                  Fans will collaborate with you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
