// Imports
import { useState } from "react";



// Component
export const DropDownMenu = ({children, section, activeSection}) => {

    /* State */
    const [expand, setExtend] = useState(false);

    /* Constants */

    /* Fonctions */
    // const endpointFilter = (endpoint) => {
    //     const searchLower = search.toLowerCase();

    //     if (section.name.toLowerCase().includes(searchLower)) return true;
    //     return endpoint.title.toLowerCase().includes(searchLower);
    // }

    /* Effects & Memos  */



    /* JSX CODE */
    return <>
        <div 
            className="nav-section" 
            onClick={(e) => {
                e.stopPropagation();
                setExtend(!expand);
            }}
        >

            <button 
                className={`nav-section-title ${activeSection === section.name ? 'section-active' : ''}`}
            >
                {
                    expand ? (
                        <svg className="expandIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" htmlclass="bi bi-caret-down-fill" viewBox="0 0 16 16">
                            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                        </svg>
                    ): (
                        <svg className="expandIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" htmlclass="bi bi-caret-right-fill" viewBox="0 0 16 16">
                            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z"/>
                        </svg>
                    )
                }
                <span>{section.name}</span>
            </button>

            { expand &&
                <>
                    {children}
                </>
            }

        </div>
    </>
}