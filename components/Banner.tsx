'use client'
import Link from "next/link";

type BannerProps = {
  text?: string;
  heading?: string;
  imgUrl: string;
  shade?: string;
  textColor?: string;
  link: string;
  buttonText: string;
  scrollDown?: boolean;
}

const Banner = ({ imgUrl, text, heading, textColor, shade, link, buttonText, scrollDown }: BannerProps) => {
  return (
    <div className="p-6 mt-10 md:mt-0">

      <div className="relative w-full h-[400px] rounded-xl  sm:h-[500px] md:h-[600px] bg-cover bg-center" style={{ backgroundImage: `url(${imgUrl})` }}>
        <div className={`absolute inset-0  opacity-60 rounded-xl`}
          style={{ background: `linear-gradient(to bottom, ${shade} 0%, transparent 100%)` }}>
        </div>
        <div className={`relative z-5 flex flex-col items-center justify-center h-full text-center px-6 md:px-12 lg:px-24`} style={{color:textColor}}>
          <h1 className="text-heading2-bold sm:text-heading1-bold font-extrabold mb-6 leading-tight">
            {heading}
          </h1>
          <p className="text-heading4-bold sm:text-heading3-bold mb-10 max-sm:hidden">
            {text}
          </p>
          {scrollDown ?
            <button onClick={() => window.scroll(0, 800)} className="bg-white text-black font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              {buttonText}
            </button> :
            <Link href={link}>
              <div className="bg-white text-black font-medium py-3 px-8 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out">
              {buttonText}
              </div>
            </Link>
            }
        </div>
      </div>
    </div>
  )
}

export default Banner