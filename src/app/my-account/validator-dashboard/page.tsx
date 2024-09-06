import React from "react";
import ValidatorDashboard from "@/app/components/ValidatorDashboard";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

const page = () => {
  return (
    <div className="main">
      <Navbar />
      <ValidatorDashboard />
      <Footer />
    </div>
  );
};

export default page;
