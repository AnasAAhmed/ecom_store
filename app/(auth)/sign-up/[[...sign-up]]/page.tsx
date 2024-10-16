import { SignUp } from "@clerk/nextjs";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borcelle | Sign-Up",
  description: "Borcelle Ecommerce Store Authentication",
};

export const dynamic = 'force-dynamic'; 

export default function Page() {
  return (
    <div className="sm:mt-8 mt-24 flex justify-center items-center">
      <SignUp />
    </div>
  );
}
