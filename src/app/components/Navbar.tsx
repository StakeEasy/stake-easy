import React, { useState, useContext } from "react";
import styles from "../css/BtnShine.module.css";
import Image from "next/image";
import Hero from "../assets/logo.png";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const NavBar = () => {
  return (
    <div className="px-[60px] py-5 mx-auto sm:max-w-xl md:max-w-full  md:px-24 lg:px-8 w-[90%] ">
      <div className="relative flex items-center justify-between">
        <div className="flex items-center">
          <a
            href="/"
            aria-label="StakeEasy"
            title="StakeEasy"
            className="inline-flex items-center mr-8"
          >
            <Image
              src={Hero}
              alt="My Image"
              style={{ width: "40px", color: "white" }}
            />
            <div
              className="ml-2 text-[26px] font-semibold tracking-wide logo"
              style={{
                animation: "typing 4s steps(40, end) 4s infinite",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              StakeEasy
            </div>
          </a>
        </div>
        <div className="flex items-center">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
