import Navbar from "@/app/components/Navbar";
import Stepper from "@/app/pages/Stepper";
import Footer from "./components/Footer";
import OperatorSelectionTable from "./components/OperatorSelectionTable";

export default function Home() {
  return (
    <div className="main">
      <Navbar />
      {/* <OperatorSelectionTable /> */}
      <Stepper />
      <Footer />
    </div>
  );
}
