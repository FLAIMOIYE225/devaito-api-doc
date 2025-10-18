import { useState } from 'react'
import apiConfig from '../data/api.config.json'
import { DropDownMenu } from './DropDownMenu';
import { EndpointsItem } from './EndpointsItem';
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
        if (!search) return true;

        const searchLower = search.toLowerCase();

        // Vérifie si le nom de la section correspond
        if (section.name.toLowerCase().includes(searchLower)){ 
            return true
        };

        if (section.subsections){
            return section.subsections.some(subsection => // Vérifier si au moins une des subsections ou un des endpoints de la subsection match avec search
                subsection.name.toLowerCase().includes(searchLower) // Vérifier si au moins une des subsection match avec search
                || // Ou
                subsection.endpoints.some(endpoint => // Vérifier si au moins un des endpoints de la subsection match avec search
                    endpoint.title.toLowerCase().includes(searchLower)
                )
            );
        }

        // Vérifie si au moins un endpoint correspond
        return section.endpoints.some(endpoint => // Vérifier si au moins un des endpoints match avec search
            endpoint.title.toLowerCase().includes(searchLower)
        );
    };



    /* Effects & Memos  */



    /* JSX CODE */
    return <>
        <div className="sidebar" id="sidebar">
            <div className="sidebar-header">
                <div className="logo">Devaito API Doc</div>
                <div className="version">Version {apiConfig.version}</div>
            </div>
            
            <div className="search-container">
                <input value={search} onChange={handleSearch} type="search" className="search-input" placeholder="Search by section or endpoint..."/>
                {/* {search} */}
            </div>

            <nav className="navigation">

                {sections
                    .filter(sectionFilter)
                    // .sort((a, b) => a.name.localeCompare(b.name))
                    .map( (section) => {
                        if (section.subsections?.length > 0 ){
                            return (
                                <DropDownMenu key={section.name} section={section} activeSection={activeSection}>
                                    {section.subsections
                                        .filter( (subsection) =>  { // Filtrer les subsections pour éliminer celle qui ne match pas avec 'search'
                                            const searchLower = search.toLowerCase();

                                            return subsection.endpoints.some(endpoint => // Vérifier si au moins un des endpoints de la subsection match avec search
                                                endpoint.title.toLowerCase().includes(searchLower)
                                            )
                                        })
                                        .map((section) => {
                                            // console.log(section);
                                            return (
                                                <div key={section.name} style={{marginLeft: 20}}>
                                                    <DropDownMenu section={section} activeSection={activeSection}>
                                                        <EndpointsItem setCurrentSection={setCurrentSection} section={section} currentEndpoint={currentEndpoint} setCurrentEndpoint={setCurrentEndpoint} activeSection={activeSection} setActiveSection={setActiveSection} search={search}></EndpointsItem>
                                                    </DropDownMenu>               
                                                </div>
                                            )                     
                                        })
                                    }
                                </DropDownMenu>
                            )
                        }

                        return (
                            // <DropDownMenu key={section.name} setCurrentSection={setCurrentSection} section={section} currentEndpoint={currentEndpoint} setCurrentEndpoint={setCurrentEndpoint} activeSection={activeSection} setActiveSection={setActiveSection} search={search}/>
                            <DropDownMenu key={section.name} section={section} activeSection={activeSection}>
                                <EndpointsItem setCurrentSection={setCurrentSection} section={section} currentEndpoint={currentEndpoint} setCurrentEndpoint={setCurrentEndpoint} activeSection={activeSection} setActiveSection={setActiveSection} search={search}></EndpointsItem>
                            </DropDownMenu>
                        )

                    })
                }

            </nav>

        </div>
    </>
}