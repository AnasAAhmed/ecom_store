import Image from "next/image";
import Link from "next/link";


const Footer = () => {
  return (
    <footer
      className={`self-stretch flex flex-col items-start justify-start mt-[3.125rem] px-3 md:px-[6.25rem] pb-[2.375rem] box-border gap-[1rem] max-w-full text-left text-[1rem] text-darkgray font-poppins mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border mq800:gap-[1.5rem] mq800:pt-[4rem] mq800:px-[3.125rem] mq800:pb-[1.563rem] mq800:box-border `}
    >
      <div className="self-stretch h-[0.063rem] relative box-border z-[1] border-t-[1px] border-solid border-gainsboro-200" />

      <div className="w-[70.938rem] flex flex-row items-start justify-start py-[0rem] px-[0.125rem] box-border max-w-full">
        <div className="flex-1 flex flex-col sm:flex-row items-start justify-between max-w-full gap-[0.25rem] mq1150:flex-wrap">
          <div className="flex flex-col items-start justify-start pb-[6.75rem] px-[0rem]s">
            <Link href="/" className="mb-8">
              <Image src="/logo.png" alt="logo" width={130} height={100} />
            </Link>
            <p className="m-0 h-[4.5rem] relative inline-block z-[1] ">
              <span className="block">
                400 University Drive Suite 200 Coral Gables,
              </span>
              <span className="block">FL 33134 USA</span>
              <span className="block mt-8">111-222-2233-4444</span>
              <span className="block">example@gmail.com</span>
            </p>
          </div>
          <div className="flex flex-col items-start justify-start py-[0rem] pr-[0.5rem] pl-[0rem] gap-[3.437rem]">
            <div className="h-[1.5rem] relative font-medium inline-block z-[1]">
              Links
            </div>
            <div className="flex flex-row items-start justify-start py-[0rem] pr-[0rem] pl-[0.125rem] text-black">
              <div className="flex flex-col items-start justify-start gap-[2.856rem]">
                <div className="h-[1.5rem] relative font-medium inline-block z-[1]">
                  Home
                </div>
                <div className="relative font-medium z-[1]">Shop</div>
                <div className="h-[1.5rem] relative font-medium inline-block z-[1]">
                  About
                </div>
                <div className="h-[1.5rem] relative font-medium inline-block z-[1]">
                  Contact
                </div>

              </div>
            </div>
          </div>
          <div className="w-[31.125rem] flex flex-col items-start justify-start gap-[1.75rem] max-w-full text-black mq800:gap-[1.375rem]">
            <div className="self-stretch flex flex-row items-start justify-start gap-[1.5rem] mq800:flex-wrap mq800:gap-[2.25rem]">
              <div className="relative font-medium z-[1]">Payment Options: Cash on delivery/Online</div>
            </div>
            <div className="h-[1.5rem] relative font-medium inline-block z-[1]">
              Returns
            </div>
            <div className="relative font-medium z-[1]">Privacy Policies</div>
            <div className="relative font-medium z-[1]">Help</div>
            <div className="flex-1 flex flex-wrap items-start justify-start gap-[0.687rem] min-w-[11.625rem] text-[0.875rem] text-darkgray">
              <div className="flex-1 flex flex-col items-start justify-start gap-[0.187rem]">
                <input type="email" placeholder="Enter your Email" className="h-[1.313rem] relative inline-block  z-[1] border border-black py-4 px-2 rounded-sm" />
              </div>
              <div className="w-[4.688rem] flex flex-col items-start justify-start gap-[0.187rem]">
                <button className=" bg-black p-2 rounded-md text-white hover:opacity-45">SUBSCRIBE</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-col items-start justify-start gap-[2.125rem] text-black">
        <div className="self-stretch h-[0.063rem] relative box-border z-[1] border-t-[1px] border-solid border-gainsboro-200" />
        <div className="flex flex-row items-start justify-start py-[0rem] px-[0.125rem]">
          <div className="relative z-[1]">
            2024 Ecommerce All rights reverved
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;