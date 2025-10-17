import { useState } from 'react'
import apiConfig from '../data/api.config.json'
import { DropDownMenu } from './DropDownMenu';
// import { useState } from 'react' 

export default function Sidebar({setCurrentSection, sections}){

    /* States */
    const [search, setSearch] = useState('');
    const [currentEndpoint, setCurrentEndpoint] = useState('');
    const [activeSection, setActiveSection] = useState(false);


    /* Constantes */
    // let isCurrentSectionMatched = false;


    /* Functions diverses & Handlers */
    const handleSearch = (event) => {
        setSearch(event.target.value);
    }

    // Filtre les sections selon le search : affiche la section si son nom ou au moins un endpoint correspond
    const sectionFilter = (section) => {
        // isCurrentSectionMatched = false;

        if (!search) return true;

        const searchLower = search.toLowerCase();

        // Vérifie si le nom de la section correspond
        if (section.name.toLowerCase().includes(searchLower)){ 
            // isCurrentSectionMatched = true;
            // if (section.name === 'Authentification') console.log(isCurrentSectionMatched);
            return true
        };

        // Vérifie si au moins un endpoint correspond
        return section.endpoints.some(endpoint =>
            endpoint.title.toLowerCase().includes(searchLower)
        );
    };

    // const endpointFilter = (endpoint) => {
    //     if (endpoint.id === 'auth-login' || endpoint.id === 'auth-logout') console.log('auth:', isCurrentSectionMatched);
    //     if (isCurrentSectionMatched) return true
    //     return endpoint.title.toLowerCase().includes(search.toLowerCase());
    // }



    /* Effects & Memos  */



    /* JSX CODE */
    return <>
        <div className="sidebar" id="sidebar">
            <div className="sidebar-header">
                <div className="logo">Devaito API Doc</div>
                <div className="version">Version {apiConfig.version}</div>
            </div>
            
            <div className="search-container">
                <input value={search} onChange={handleSearch} type="text" className="search-input" placeholder="Find an endpoint..."/>
                {/* {search} */}
            </div>

            <nav className="navigation">

                {sections
                .filter(sectionFilter)
                // .sort((a, b) => a.name.localeCompare(b.name))
                .map( (section) => {

                    return (
                        <DropDownMenu key={section.name} setCurrentSection={setCurrentSection} section={section} currentEndpoint={currentEndpoint} setCurrentEndpoint={setCurrentEndpoint} activeSection={activeSection} setActiveSection={setActiveSection} search={search}/>
                    )

                })}

            </nav>

        </div>
    </>
}