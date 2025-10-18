

export const EndpointsItem = ({currentEndpoint, section, setActiveSection, setCurrentEndpoint, setCurrentSection, search}) => {

    /* Constantes & Variables */

    
    /* Fonctions */
    const endpointFilter = (endpoint) => {
        const searchLower = search.toLowerCase();

        if (section.name.toLowerCase().includes(searchLower)) return true;
        return endpoint.title.toLowerCase().includes(searchLower);
    }


    /* JSX CODE */
    return (
        <>
            {section.endpoints
                .filter(endpointFilter)
                .map((endpoint) => {
                    return(
                        <div
                            key={endpoint.id}
                            className={`nav-item ${currentEndpoint === endpoint.id ? "active-endpoint" : ''}`}
                            data-section="auth" 

                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveSection(section.name);
                                setCurrentSection(section);
                                setCurrentEndpoint(endpoint.id);
                                setTimeout(() => {
                                    const mainContentSection = document.getElementById(`${endpoint.id}-section`);
                                    if (mainContentSection) {
                                        mainContentSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }, 0);
                            }}
                        >
                            <div className={`nav-item-icon method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</div>
                            <span>{endpoint.title}</span>
                        </div>
                    )
                })
            }
        </>
    )
}