import { useState } from 'react';
import apiConfig from '../data/api.config.json';
// import endpoints from '../data/endpoints.json'
import copy from '../utils/clipborad';
import Endpoint from './Endpoint';

export default function MainContent({currentSection}){

    /* States */
    const [token, setToken] = useState('');

    /* Effects & Memos */

    /* JSX CODE */
    return <>
        {/* <div className="main-content" style={{marginBottom: 400}}> */}
        <div className="main-content" style={{marginBottom: '30rem'}}>
        {/* <div className="main-content"> */}
            <button className="theme-toggle" id="themeToggle">🌙</button>

            <div className="content-header">

                <div className="row-container">

                    <div className='image-container'>
                        <img src="devaito-logo.png" alt="" />
                        <h1 className='content-title'>'s</h1>
                    </div> 

                    <h1 className="content-title">API Documentation</h1>                    
                </div>

                <p className="content-description">
                    This guide provides a list of available endpoints to request access to specific store data.
                </p>
            </div>

            <div className="content-body">

                <div className="api-base-url">
                    <div className="header">
                        <span className="label">BASE URL</span>
                        <span className="copy-icon" onClick={ () => copy(apiConfig.baseShopUrl) }>
                            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" className="⚙     as-5a as-1p as-1q as-1r as-4j as-71 as-72 as-2z ⚙884z3a"><path fillRule="evenodd" clipRule="evenodd" d="M4 6.375c0-.345.28-.625.625-.625h2.75a.625.625 0 1 1 0 1.25h-2.75A.625.625 0 0 1 4 6.375Zm0 2.25C4 8.28 4.28 8 4.625 8h2.75a.625.625 0 1 1 0 1.25h-2.75A.625.625 0 0 1 4 8.625Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M8.437 1.5A2 2 0 0 0 6.5 0h-1a2 2 0 0 0-1.937 1.5H3a2 2 0 0 0-2 2V10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-.563ZM4.9 3.1h2.2V2a.6.6 0 0 0-.6-.6h-1a.6.6 0 0 0-.6.6v1.1ZM8 4.5H4a.5.5 0 0 1-.5-.5V2.9H3a.6.6 0 0 0-.6.6V10a.6.6 0 0 0 .6.6h6a.6.6 0 0 0 .6-.6V3.5a.6.6 0 0 0-.6-.6h-.5V4a.5.5 0 0 1-.5.5Z"></path></svg>
                        </span>
                    </div>
                    <div className="url">{apiConfig.baseShopUrl}</div>
                </div>

                <div className='text-block' style={{ marginTop: 60, marginBottom: 20}}>
                    <div className='text-header'>Section Description</div>
                    <div className="text-content">
                        {currentSection?.description}
                    </div>
                </div>

                {currentSection.endpoints.map( (endpoint) => {
                    return <Endpoint endpoint={endpoint} key={endpoint.id} baseShopUrl={apiConfig.baseShopUrl} setToken={setToken} token={token} />
                })}

            </div>
        </div>
        
    </>
}