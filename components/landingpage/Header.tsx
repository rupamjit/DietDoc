"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { SquarePen, AlignJustify } from "lucide-react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { checkUser } from "@/actions/user";
import Image from "next/image";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);


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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center border px-4 sm:px-6 md:px-10 border-b-2 border-gray-500 h-auto sm:h-20 py-4 sm:py-0 sticky top-0 z-10 bg-white">
      {/* Logo */}
      <div className="flex justify-between items-center w-full sm:w-auto">
        <Link href="/">
            <div className="flex items-center gap-2">
              <Image src="/logo.png" width={50} height={50} alt="NutriFitAI Logo" />
              <h1 className="text-2xl sm:text-3xl font-extrabold hidden sm:block">
                NutriFitAI
              </h1>
            </div>
          </Link>
        <button
          className="sm:hidden p-2 focus:outline-none"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <AlignJustify className="w-6 h-6" />
        </button>
      </div>

      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row justify-center sm:justify-between gap-3 sm:gap-5 w-full sm:w-auto mt-4 sm:mt-0`}
      >
        
          <Link href="/profile">
            <Button className="cursor-pointer flex items-center gap-2 text-xs sm:text-sm md:text-base px-2 sm:px-3 md:px-4 py-1 sm:py-2 w-full sm:w-auto justify-center sm:justify-start">
              <SquarePen className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="block">Create Profile</span>
            </Button>
          </Link>

        <SignedOut>
          <SignInButton forceRedirectUrl="/dashboard">
            <Button className="cursor-pointer text-sm sm:text-base px-3 sm:px-4 py-2">
              Login
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
  );
};

export default Header;