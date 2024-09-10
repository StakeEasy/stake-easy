import React from "react";
import Image from "next/image";
import Hero from "../assets/StakeEasy.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Navbar = () => {
  return (
    <div className="pt-5 pb-5 mx-auto  w-[90%] ">
      <div className="relative flex items-center justify-between">
        <a href="/" aria-label="StakeEasy" title="StakeEasy">
          <Image src={Hero} alt="hero_img" width={220} height={220} />
        </a>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;