import type { NextPage } from "next";
import BlogPostList from "@/components/BlogPostList";

const Blog: NextPage = () => {
    return (
        <>
        <h1 className="w-full flex mt-8 h-14 text-heading2-bold justify-center">Blog</h1>
            <div className="w-full relative bg-white overflow-hidden flex flex-col items-start justify-start leading-[normal] tracking-[normal]">
                <section className="self-stretch bg-white flex flex-col items-center justify-start pt-[2rem] pb-[0rem] pr-[1.437rem] pl-[1.25rem] box-border gap-[3.375rem] max-w-full mq800:gap-[1.688rem] mq800:pt-[1.438rem] mq800:box-border mq1350:pt-[2.25rem] mq1350:box-border">
                    <div className="w-[90rem] h-[169.375rem] relative bg-white hidden max-w-full" />
                    <BlogPostList />
                </section>
            </div>
        </>
    );
};

export default Blog;