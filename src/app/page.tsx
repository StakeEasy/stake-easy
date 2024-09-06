import Navbar from "@/app/components/Navbar";
import Stepper from "@/app/pages/Stepper";
import Footer from "./components/Footer";
import OperatorSelectionTable from "./components/OperatorSelectionTable";
import Image from "next/image";
import Landing from "./components/Landing";
import React from 'react';

export default function Home() {
  return (
    <div className="main">
      <Navbar />
      {/* <OperatorSelectionTable /> */}
      <Stepper />
      {/* <Landing /> */}
      <Footer />
      {/* <UserFlow /> */}
    </div>
  );
}
