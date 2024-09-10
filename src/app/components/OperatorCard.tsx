import React from "react";
import Image from "next/image";
import icon from "../assets/icon.png";
import { Copy, Info } from "lucide-react";
import { Tooltip } from "antd";

interface OperatorCardProps {
  name: string;
  id: number;
  status: string;
  performance: string;
  // fee: string;
}

const OperatorCard: React.FC<OperatorCardProps> = ({
  name,
  id,
  status,
  performance,
  // fee,
}) => {
  return (
    <div
      className="   shadow-lg"
      style={{
        border: "1px solid #A6A6A6",
        borderRadius: "10px",
        textAlign: "center",
        color: "white",
        background: "linear-gradient(to right, #171717, #252525)",
      }}
    >
      <div className="p-4">
        <Image
          src={icon}
          alt=""
          className=" mb-3 "
          style={{
            borderRadius: "20px",
            padding: "3px",

            border: "1px solid #A6A6A6",
            background: "linear-gradient(to right, #1d1d1d, #191919)",
          }}
        />
        <div className="flex items-center justify-between  row">
          <div className="text-sm font-semibold">{name}</div>
          <div className="text-xs text-gray-400">ID: {id}</div>
        </div>
      </div>
      <div>
        <div style={{ borderBottom: "1px solid #A6A6A6" }}></div>
        <div className="flex items-center justify-between p-4  text-[#A6A6A6]">
          <div className="text-xs flex items-center">
            <span className="mr-1">Status</span>
            <Tooltip
              title="Is the operator performing duties for the majority of its validators for the last 2 epochs"
              color="#121212"
              overlayInnerStyle={{
                border: "1px solid transparent",
                borderImage: "linear-gradient(to right, #A257EC , #DA619C )",
                borderImageSlice: 1,
                fontSize: "12px",
              }}
            >
              <Info size={10} />
            </Tooltip>
          </div>
          <div className="text-xs">30D Perform</div>
          {/* <div className="text-xs">Yearly Fee</div> */}
        </div>
        <div className="flex items-center justify-between pb-4 pl-4 pr-4">
          <div
            className={`text-xs ${
              status === "Active"
                ? "text-green-500 bg-[#D5F5E3] rounded-[5px] p-[5px] "
                : "text-red-500 bg-[#D5F5E3] rounded-[5px] p-[5px]"
            }`}
          >
            {status}
          </div>
          <div className="text-xs">{performance}</div>
          {/* <div className="text-xs">{fee}</div> */}
        </div>
      </div>
    </div>
  );
};

export default OperatorCard;