'use client';

import React, { useEffect } from "react";
import Image from "next/image";
import Hero from "../assets/StakeEasy.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';

const NavBar = () => {
  const { address, isConnected } = useAccount();
  if(isConnected){
    console.log("Address: ",address)
  }
  useEffect(() => {
    if (address) {
      console.log("Connected wallet address:", address);
      fetch('/api/AddWalletAddress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address }),
      })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    }
  }, [address]);
  
  return (
    <div className="px-[60px] py-5 mx-auto sm:max-w-xl md:max-w-full  md:px-24 lg:px-8 w-[90%] ">
      <div className="relative flex items-center justify-between">
        <a
          href="/"
          aria-label="StakeEasy"
          title="StakeEasy"
        >
          <Image src={Hero} alt="hero_img" width={220} height={220} />
        </a>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;