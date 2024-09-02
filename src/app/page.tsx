import Navbar from "@/app/components/Navbar";
import Stepper from "@/app/pages/Stepper";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="main">
      <Navbar />
      <Stepper />
      <Footer />
    </div>
  );
}
