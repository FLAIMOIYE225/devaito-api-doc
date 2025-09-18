import { useState } from "react";
import "./styles.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import sections from "./data/endpoitntSections.json"
// import Formulaire from "./components/Test";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    const [currentSection, setCurrentSection] = useState(sections[0]);

    return(
      <div className="custom-container">
          <Sidebar setCurrentSection={setCurrentSection} sections={sections} />
          <MainContent currentSection={currentSection}/>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
      </div>
    )

}
