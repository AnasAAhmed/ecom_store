import React from 'react'
import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";
import Link from 'next/link';
const BlogSection = () => {
  return (
    <section
    className={`max-sm:hidden self-stretch flex flex-col items-center justify-start pt-[3.437rem] px-[1.25rem] pb-[3.25rem] box-border gap-[4.062rem] max-w-full z-[6] text-left text-[2.25rem] text-black font-poppins mq750:gap-[2rem] mq750:pt-[1.438rem] mq750:pb-[1.375rem] mq750:box-border mq450:gap-[1rem] mq1050:pt-[2.25rem] mq1050:pb-[2.125rem] mq1050:box-border `}
  >
    <div className="w-[90rem] h-[59rem] relative bg-white hidden max-w-full" />
    <div className="w-[77.5rem] flex flex-row items-start justify-center py-[0rem] pr-[1.312rem] pl-[1.25rem] box-border max-w-full">
      <div className="w-[29.938rem] flex flex-col items-start justify-start gap-[0.812rem] max-w-full">
        <div className="self-stretch flex flex-row items-start justify-center py-[0rem] pr-[1.25rem] pl-[1.312rem]">
          <h1 className="m-0 h-[3.375rem] relative text-inherit font-medium font-inherit inline-block z-[1] mq750:text-[1.813rem] mq450:text-[1.375rem]">
            Our Blogs
          </h1>
        </div>
        <div className="relative text-[1rem] font-medium text-darkgray z-[1]">
          Find a bright ideal to suit your taste with our great selection
        </div>
      </div>
    </div>
    <div className="w-[77.5rem] flex flex-col items-start justify-start gap-[4.687rem] max-w-full text-[1.25rem] mq750:gap-[2.313rem] mq450:gap-[1.188rem]">
      <div className="self-stretch flex flex-wrap items-start justify-center gap-[1.937rem] max-w-full z-[1] mq750:gap-[0.938rem] mq1050:flex-wrap">
        <GroupComponent3 blogCardImage="https://figma-to-code-ecom-design.vercel.app/rectangle-13@2x.png" />
          <GroupComponent3
            blogCardImage="https://figma-to-code-ecom-design.vercel.app/rectangle-14@2x.png"
            // propWidth="unset"
            // propMinWidth="15.938rem"
            // propFlex="1"
            // propPadding="0rem 1.687rem"
            // propGap="1rem"
          />
          <GroupComponent3
            blogCardImage="https://figma-to-code-ecom-design.vercel.app/rectangle-15@2x.png"
            // propWidth="unset"
            // propMinWidth="15.938rem"
            // propFlex="1"
            // propPadding="0rem 1.625rem 0rem 1.75rem"
            // propGap="0.937rem"
          />
        {/* </div> */}
      </div>
      <div className="self-stretch flex flex-row items-start justify-center py-[0rem] px-[1.25rem]">
        <div className="w-[7.875rem] flex flex-col items-start justify-start gap-[1.187rem]">
          <Link href="/blog" className="h-[1.875rem] relative font-medium inline-block z-[1] mq450:text-[1rem]">
            View All Post
          </Link>
          <div className="self-stretch flex flex-row items-start justify-start py-[0rem] pr-[0.187rem] pl-[0.375rem]">
            <div className="h-[0.125rem] flex-1 relative box-border z-[1] border-t-[2px] border-solid border-black" />
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export type GroupComponent3Type = {
    className?: string;
    blogCardImage?: string;
  
    /** Style props */
    propWidth?: CSSProperties["width"];
    propMinWidth?: CSSProperties["minWidth"];
    propFlex?: CSSProperties["flex"];
    propPadding?: CSSProperties["padding"];
    propGap?: CSSProperties["gap"];
  };
  
  const GroupComponent3: NextPage<GroupComponent3Type> = ({
    className = "",
    blogCardImage,
    propWidth,
    propMinWidth,
    propFlex,
    propPadding,
    propGap,
  }) => {
    const groupDivStyle: CSSProperties = useMemo(() => {
      return {
        width: propWidth,
        minWidth: propMinWidth,
        flex: propFlex,
      };
    }, [propWidth, propMinWidth, propFlex]);
  
    const blogCardContentStyle: CSSProperties = useMemo(() => {
      return {
        padding: propPadding,
      };
    }, [propPadding]);
  
    const frameDivStyle: CSSProperties = useMemo(() => {
      return {
        gap: propGap,
      };
    }, [propGap]);
  
    return (
      <div
        className={`w-[24.563rem] flex flex-col items-start justify-start gap-[2.062rem] min-w-[24.563rem] max-w-full text-left text-[1.25rem] text-black font-poppins mq750:min-w-full mq450:gap-[1rem] mq1050:flex-1 ${className}`}
        style={groupDivStyle}
      >
        <img
          className="self-stretch h-[24.563rem] relative rounded-3xs max-w-full overflow-hidden shrink-0 object-cover"
          loading="lazy"
          alt=""
          src={blogCardImage}
        />
        <div
          className="self-stretch flex flex-row items-start justify-start py-[0rem] px-[1.687rem] box-border max-w-full"
          style={blogCardContentStyle}
        >
          <div className="flex-1 flex flex-col items-start justify-start gap-[0.625rem] max-w-full">
            <div className="relative mq450:text-[1rem]">
              Going all-in with millennial design
            </div>
            <div className="self-stretch flex flex-row items-start justify-center py-[0rem] pr-[1.312rem] pl-[1.25rem] text-[1.5rem]">
              <Link href={'/blog'} className="m-0 h-[2.25rem] relative text-inherit font-medium font-inherit inline-block mq450:text-[1.188rem]">
                Read More
              </Link>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start py-[0rem] px-[3.625rem] text-[1rem] mq450:pl-[1.25rem] mq450:pr-[1.25rem] mq450:box-border">
              <div
                className="flex-1 flex flex-col items-end justify-start gap-[1.062rem]"
                style={frameDivStyle}
              >
                <div className="self-stretch flex flex-row items-start justify-end py-[0rem] pr-[3.187rem] pl-[3.437rem]">
                  <div className="h-[0.125rem] flex-1 relative box-border border-t-[2px] border-solid border-black" />
                </div>
                <div className="self-stretch flex flex-row items-start justify-start gap-[1.187rem]">
                  <div className="flex flex-row items-start justify-start gap-[0.625rem]">
                    <div className="flex flex-col items-start justify-start pt-[0.187rem] px-[0rem] pb-[0rem]">
                      <img
                        className="w-[1.125rem] h-[1.113rem] relative"
                        alt=""
                        src="https://figma-to-code-ecom-design.vercel.app/group.svg"
                      />
                    </div>
                    <div className="h-[1.5rem] relative font-light inline-block">
                      5 min
                    </div>
                  </div>
                  <div className="flex flex-row items-start justify-start gap-[0.625rem]">
                    <img
                      className="h-[1.375rem] w-[1.375rem] relative overflow-hidden shrink-0"
                      alt=""
                      src="https://figma-to-code-ecom-design.vercel.app/uilcalender.svg"
                    />
                    <div className="h-[1.5rem] relative font-light inline-block">
                      12
                      <sup>th</sup> Oct 2022
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  

export default BlogSection
