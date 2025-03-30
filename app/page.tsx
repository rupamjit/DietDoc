"use client"
import { checkUser } from "@/actions/user";
import { Button } from "@/components/ui/button";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { useEffect } from "react";


export default function Home() {


  useEffect(() => {
    const storeUserData = async () => {
      try {
        await checkUser();
      } catch (error) {
        console.log(`Error in storing data: ${error}`);
      }
    };
    storeUserData();
  });

  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <SignedOut>
          <SignInButton forceRedirectUrl="/profile">
            <Button className="cursor-pointer text-sm sm:text-base px-3 sm:px-4 py-2">
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
    </div>
  );
}
