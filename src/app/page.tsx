import Navbar from "@/app/components/Navbar";
import Footer from "./components/Footer";
import Landing from "./components/Landing";

import "../app/css/Landing.css";

export default function Home() {
  return (
    <div className="main bg_image">
      <Navbar />
      <Landing />
      <Footer />
    </div>
  );
}
