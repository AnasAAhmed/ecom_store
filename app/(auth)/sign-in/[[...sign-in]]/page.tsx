import { SignIn } from "@clerk/nextjs";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Borcelle | Sign-In",
  description: "Borcelle Ecommerce Store Authentication",
};

export default function Page() {
  return (
    <div className="sm:mt-8 mt-24 flex justify-center items-center">
      <SignIn />
    </div>
  );
}
