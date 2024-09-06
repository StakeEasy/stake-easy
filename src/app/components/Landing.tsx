import React from "react";
import Image from "next/image";
import starImg from "../assets/Frame 5.png";

const Landing = () => {
  return (
    <div
      className="relative mx-auto transition-all duration-300 w-[80%] z-10"
      style={{
        background: "linear-gradient(to right, #1D1D1D 0%, #191919 100%)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "80px 40px",
        borderRadius: "20px",
      }}
    >
      <Image
        src={starImg}
        alt=""
        className="w-70 h-70 absolute bottom-0 left-0 overflow-hidden -z-10"
      />
      <div className="text-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl">Stake, Earn, Spend</h1>
        <h3 className="text-2xl">
          Stake ETH, get eETH - the liquid restaking token that rewards you more
          across DeFi.
        </h3>
        <button
          className={`min-w-16 bg-[#161515] text-white font-medium py-3 px-4 rounded-md text-sm transition-all duration-300`}
          style={{
            border: "1px solid transparent",
            borderImage: "linear-gradient(to right, #DA619C , #FF844A )",
            borderImageSlice: 1,
            background: "linear-gradient(to right, #DA619C, #FF844A)",
            WebkitBackgroundClip: "text",
          }}
        >
          <span className="text-2xl">Stake</span>
        </button>
      </div>
    </div>
  );
};

export default Landing;