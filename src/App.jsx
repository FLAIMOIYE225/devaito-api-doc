import { useState } from "react";
import "./styles.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import sections from "./data/endpoitntSections.json"
// import Formulaire from "./components/Test";

export default function App() {
    const [currentEndpoints, setCurrentEndpoints] = useState(sections[0].endpoints)

    return(
      <div className="custom-container">
          <Sidebar setCurrentEndpoints={setCurrentEndpoints} sections={sections} />
          <MainContent endpoints={currentEndpoints}/>
      </div>
    )

}
