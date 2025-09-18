import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import copy from "../utils/clipborad";
import { getResource, postResource, requestResource } from "../utils/api/requestHandler";
import { parseUrl, buildRequestBody } from "../utils/formatters/requestFormatter";
import { notifySuccess, notifyError } from "../utils/notify";

export default function Endpoint({ endpoint, baseShopUrl, setToken, token }) {

  /* States */
  const [activeTab, setActiveTab] = useState("try"); // onglet actif (par défaut "try")
  const [response, setResponse] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const [responseStr, setResponseStr] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [inputValues, setInputValues] = useState(() => { // Initialisation de l'état inputValues avec les paramètres
    const initialValues = {
      token: token,
      shopname: '',
    };
    endpoint.parameters.forEach((parameter) => {
      initialValues[parameter.name] = ""; // Utiliser example si disponible, sinon ""
    });
    return initialValues;
  });
  const [error, setError] = useState("");
  const [requestBody, setRequestBody] = useState({})
  // const [token, setToken] = useState('');
  // const [shopname, setshopname] = useState('');



  /* Constantes */
  const codeContent = endpoint.codeSamples.javascript.join("\n");
  const headers = Object.keys(endpoint.request.headers).map((key) => `${key}: ${endpoint.request.headers[key]}`).join("\n");
  const example = JSON.stringify(endpoint.responses["200"]?.example, null, 4);



  /* Functions */




  /* Event Handlers */
  const handleChange = (e) => { // Gestionnaire de changement pour les inputs
    const { name, value } = e.target;

    setInputValues((prev) => ({
      ...prev, // Conserver les autres valeurs
      [name]: value, // Mettre à jour la valeur correspondante
    }));
  };

  const tryEndpoint = async () => { // Permet de tester l'endpoint: Il envoie la requête à l'API et affiche le résultat dans la partie dédiée.
    setShowResponse(true);
    setIsloading(true);

    try {
      const url = parseUrl(baseShopUrl + endpoint.path, inputValues);

      // const options = {}
      const options = { headers: endpoint.request.headers}
      // Ajouter le  token au header dans le cas où la requête est protégé
      
      // if (endpoint.isProtected || endpoint?.isProtected){
      //   if (!inputValues.token) throw new Error("This endpoint is protected by a token. First obtain a token using the endpoint `/api/login`.");
      //   options.headers['Authorization'] = `Bearer ${inputValues.token}`;
      // }

      options.headers['Authorization'] = `Bearer ${inputValues.token}`;

      if ( endpoint.method === 'GET'){
        const responseData = await getResource(url, options);
        setResponse(responseData);

        if (error) setError('');

      } else if (endpoint.method === 'POST'){
          // const body = buildRequestBody(endpoint.parameters, inputValues);
          // const responseData = await postResource(url + endpoint.path, body);
          const responseData = await postResource(url, requestBody, options);
          setResponse(responseData);

          if (responseData.token){
            setToken(responseData.token);
          }

          if (error) setError('');
      } else {
        const responseData = await requestResource(url, endpoint.method, requestBody, options);
        setResponse(responseData);

        if (error) setError('');
      }

      notifySuccess("Request treated with success!");

    } catch (error){
      console.error(`${error.message}`);
      setError(`${error.message}`);
      notifyError("Error during query processing!");
    }

    setIsloading(false);
  };



  // Memos / Effects
  useEffect( () =>{
    setResponseStr(JSON.stringify(response, null, 4));
  }, [response]);

  useEffect( () => {
    setInputValues( (prev) => {
      return {
        ...prev,
        token: token
      }
    });
  }, [token]);

  useEffect(() => {
    setRequestBody(buildRequestBody(endpoint.parameters, inputValues));
  }, [endpoint.parameters, inputValues]);



  // HTML Jsx Code
  return (
    <div className="endpoint-section" id={`${endpoint.id}-section`}>
      <div className="endpoint-header">
        <div className="endpoint-title">
          <span
            className={`method-badge method-${endpoint.method.toLowerCase()}`}
          >
            {endpoint.method}
          </span>
          <span className="endpoint-path">{endpoint.path}</span>
        </div>
        <div className="endpoint-description">{endpoint.description}</div>
      </div>

      <div className="endpoint-body">
        {/* Boutons d’onglets */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === "try" ? "active" : ""}`}
            onClick={() => setActiveTab("try")}
          >
            Try
          </button>

          <button
            className={`tab ${activeTab === "request" ? "active" : ""}`}
            onClick={() => setActiveTab("request")}
          >
            Request
          </button>

          <button
            className={`tab ${activeTab === "response" ? "active" : ""}`}
            onClick={() => setActiveTab("response")}
          >
            Response
          </button>

          <button
            className={`tab ${activeTab === "code" ? "active" : ""}`}
            onClick={() => setActiveTab("code")}
          >
            Code
          </button>
        </div>

        {/* Contenus d’onglets */}
        {activeTab === "try" && (
          <div className="tab-content active">
            <div className="try-it-section">
              <div className="form-group">
                <label className="form-label">Shop Name</label>
                <input
                  type='text'
                  className="form-input"
                  name='shopname'
                  value={inputValues.shopname}
                  onChange={handleChange}
                  placeholder='myshopname'
                />
              </div>
              {endpoint.parameters.map((parameter, index) => {
                const parameterName =
                  parameter.name.charAt(0).toUpperCase() +
                  parameter.name.slice(1);
                  // console.log(inputValues[parameter.name]);

                return (
                  <div className="form-group" key={index}>
                    <label className="form-label">{parameterName}</label>
                    <input
                      type={parameter.inputType}
                      className="form-input"
                      name={parameter.name}
                      value={inputValues[parameter.name]}
                      onChange={handleChange}
                      placeholder={parameter.example}
                    />
                  </div>
                );
              })}

              <button className="btn btn-primary" onClick={tryEndpoint}>
                <div className={`spinner-container ${isLoading ? "" : "hidden"}`}>
                  <div
                    className="spinner-border"
                    role="status"
                    style={{ width: 20, height: 20 }}
                  >
                    <span className="visually-hidden"></span>
                  </div>
                </div>
                Try {endpoint.title}
              </button>

              {/* <div>
                {JSON.stringify(inputValues, null, 4)}
              </div> */}

              <br />

              <div className={`error-container ${error ? "": "hidden"}`}>
                <span className="error">{error}</span>              
              </div>

            </div>

            <div className={`response-section ${Object.keys(response).length && !error ? "" : "hidden"}`} id="auth-api-response">

              <div className="response-header">
                <strong>Réponse:</strong>
                <span 
                  className={`custom-button ${showResponse ? "clicked": ""}`}
                  onClick={() => setShowResponse(prev => !prev)}
                >{showResponse ? 'On': 'Off'}</span>
              </div>

              <div className={`code-block ${showResponse ? "": "hidden"}`}>
                <div className="code-content">
                  <div className="code-header">
                    <span className="code-lang">JSON Response</span>
                    <button className="copy-btn" onClick={ () => copy(responseStr) }>Copy</button>
                  </div>
                  <SyntaxHighlighter language="json" style={vscDarkPlus}>
                    {responseStr}
                  </SyntaxHighlighter>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === "request" && (
          <div className="tab-content active">
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">Headers</span>
                <button className="copy-btn" onClick={ () => copy(headers) }>Copy</button>
              </div>
              <div className="code-content">
                <SyntaxHighlighter language="http" style={vscDarkPlus}>
                  {headers}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* <br /> */}

            <div className={`code-block ${ endpoint.method.toLowerCase() === 'get' ? 'hidden': '' }`}>
              <div className="code-header">
                <span className="code-lang">Request Body</span>
                <button className="copy-btn" onClick={ () => copy(JSON.stringify(requestBody, null, 4)) }>Copy</button>
              </div>
              <div className="code-content">
                <SyntaxHighlighter language="json" style={vscDarkPlus}>
                  {JSON.stringify(requestBody, null, 4)}
                </SyntaxHighlighter>
              </div>
            </div>

          </div>
        )}

        {activeTab === "response" && (
          <div className="tab-content active">
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">JSON Response (200 OK)</span>
                <button className="copy-btn" onClick={ () => copy(example) }>Copy</button>
              </div>

              <div className="code-content">
                <SyntaxHighlighter language="json" style={vscDarkPlus}>
                  {`${example}`}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="tab-content active">
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">JavaScript (fetch)</span>
                <button className="copy-btn" onClick={() => copy(codeContent)}>
                  Copier
                </button>
              </div>

              <div className="code-content">
                <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                  {codeContent}
                </SyntaxHighlighter>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
