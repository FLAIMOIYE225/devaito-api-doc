import { useState } from "react";
import "./styles.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import sections from "./data/endpoitntSections.json"
// import Formulaire from "./components/Test";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
    const [currentEndpoints, setCurrentEndpoints] = useState(sections[0].endpoints)

    return(
      <div className="custom-container">
          <Sidebar setCurrentEndpoints={setCurrentEndpoints} sections={sections} />
          <MainContent endpoints={currentEndpoints}/>
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
