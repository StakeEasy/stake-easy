import React from "react";
import Navbar from "../components/Navbar";
import Stepper from "../pages/Stepper";
import Footer from "../components/Footer";

const page = () => {
  return (
    <div className="main">
      <Navbar />
      <Stepper />
      <Footer />
    </div>
  );
};

export default page;
