import Navbar from "@/app/components/Navbar";
import Stepper from "@/app/pages/Stepper";
import Footer from "./components/Footer";
import OperatorSelectionTable from "./components/OperatorSelectionTable";
import Image from "next/image";
import UserFlow from "./components/UserFlow";
import React from 'react';

export default function Home() {
  return (
    <div className="main">
      <Navbar />
      {/* <OperatorSelectionTable /> */}
      <Stepper />
      <Footer />
      <UserFlow />
    </div>
  );
}
