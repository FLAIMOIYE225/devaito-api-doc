/* React Imports */
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-json";
import "prismjs/components/prism-json";



/* Utils */
import copy from "../utils/clipborad";
import { parseUrl, buildRequestBody, buildUrl } from "../utils/formatters/requestFormatter";
import { notifySuccess, notifyError } from "../utils/notify";

/* APIs */
import { getResource, postResource, requestResource } from "../api/requestHandler";

export default function Endpoint({ endpoint, baseShopUrl, setToken, token }) {

  /* -------------------------------------------- */
  /* STATES                                       */
  /* -------------------------------------------- */

  const [activeTab, setActiveTab] = useState("try");
  const [response, setResponse] = useState({});
  const [showResponse, setShowResponse] = useState(false);
  const [responseStr, setResponseStr] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState("");
  const [requestBody, setRequestBody] = useState({});

  const [isThereJsonError, setIsThereJsonError] = useState(false);

  /** Initialize input values including headers coming from parameters */
  const [inputValues, setInputValues] = useState(() => {
    const initialValues = {
      token: token || "",
      shopname: "",
    };
    endpoint.parameters.forEach((p) => {
      // initialValues[p.name] = p.example || "";
      initialValues[p.name] = ""
    });
    return initialValues;
  });

  /* -------------------------------------------- */
  /* DERIVED VALUES                               */
  /* -------------------------------------------- */

  /** Build real headers dynamically */
  const buildHeadersFromInputs = () => {
    let headers = { ...endpoint.request.headers };

    // Insert Authorization header if the API requires token
    if (inputValues.token) {
      headers["Authorization"] = `Bearer ${inputValues.token}`;
    }

    // Add parameters that belong to headers
    endpoint.parameters
      .filter((p) => p.in === "header")
      .forEach((p) => {
        if (inputValues[p.name]) {
          headers[p.name] = inputValues[p.name];
        }
      });

    return headers;
  };

  const dynamicHeaders = buildHeadersFromInputs();

  const headerCodeBlock = Object.keys(dynamicHeaders)
    .map((key) => `${key}: ${dynamicHeaders[key]}`)
    .join("\n");


  const example = JSON.stringify(endpoint.responses["200"]?.example, null, 4);
  const codeContent = endpoint.codeSamples.javascript.join("\n");

  /* -------------------------------------------- */
  /* EVENT HANDLERS                               */
  /* -------------------------------------------- */

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setInputValues((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (arg1, arg2) => {
    // Case 1: Editor -> handleChange("fieldName", "newValue")
    if (typeof arg1 === "string" && typeof arg2 === "string") {
      const name = arg1;
      const value = arg2;

      setInputValues(prev => ({ ...prev, [name]: value }));
      return;
    }

    // Case 2: Normal input event
    const e = arg1;
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };


  const tryEndpoint = async (e) => {
    e.preventDefault();
    setShowResponse(true);
    setIsloading(true);
    setError("");

    try {
      let url = parseUrl(baseShopUrl + endpoint.path, inputValues);
      url = buildUrl(url, endpoint.parameters, inputValues);

      const headers = buildHeadersFromInputs();
      const options = { headers };

      let responseData;

      if (endpoint.method === "GET") {
        responseData = await getResource(url, options);
      } else if (endpoint.method === "POST") {
        responseData = await postResource(url, requestBody, options);
      } else {
        responseData = await requestResource(url, endpoint.method, requestBody, options);
      }

      setResponse(responseData);

      if (responseData.token) {
        setToken(responseData.token);
      }

      notifySuccess("Request completed successfully!");

    } catch (err) {
      console.error(err);
      setError(err.message);
      notifyError("An error occurred while processing the request.");
    }

    setIsloading(false);
  };

  /* -------------------------------------------- */
  /* EFFECTS                                      */
  /* -------------------------------------------- */

  useEffect(() => {
    setResponseStr(JSON.stringify(response, null, 4));
  }, [response]);

  useEffect(() => {
    setInputValues((prev) => ({ ...prev, token }));
  }, [token]);

  useEffect(() => {
    try {
      setIsThereJsonError(false);
      setRequestBody(buildRequestBody(endpoint.parameters, inputValues));
    } catch (err) {
      // console.warn("Invalid JSON in editor");
      // notifyError("Invalid JSON in editor");
      setIsThereJsonError(true);
    }
  }, [endpoint.parameters, inputValues]);


  /* -------------------------------------------- */
  /* JSX                                          */
  /* -------------------------------------------- */

  return (
    <div className="endpoint-section" id={`${endpoint.id}-section`}>

      {/* HEADER -------------------------------------------------------- */}
      <div className="endpoint-header">
        <div className="endpoint-title">
          <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>
            {endpoint.method}
          </span>
          <span className="endpoint-path">{endpoint.path}</span>
        </div>
        <div className="endpoint-description">{endpoint.description}</div>
      </div>

      {/* BODY ---------------------------------------------------------- */}
      <div className="endpoint-body">

        {/* TABS */}
        <div className="tabs">
          {["try", "request", "response", "code"].map((tab) => (
            <button
              key={tab}
              className={`tab ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}

          {endpoint.details && (
            <button
              className={`tab ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              Details
            </button>
          )}
        </div>

        {/* ------------------------- TRY TAB ------------------------- */}
        {activeTab === "try" && (
          <form 
            className="tab-content active"
            onSubmit={(e) => tryEndpoint(e)}
          >
            <div className="try-it-section">

              {/* Shop name */}
              <div className="form-group">
                <label 
                  className="form-label"
                  title="The name (subdomain) of the target DEVAITO shop."
                >
                  Shop Name
                </label>
                <span 
                  title="This field is required."
                  className="field-required"
                >
                  *
                </span>
                <input
                  required
                  type="text"
                  className="form-input"
                  name="shopname"
                  value={inputValues.shopname}
                  onChange={handleChange}
                  placeholder="myshopname"
                />
              </div>

              {/* Dynamic parameters */}
              {endpoint.parameters.map((p, index) => (
                <div className="form-group" key={index}>
                  <label 
                    className="form-label"
                    title={p?.description}
                  >
                    {p.name} ({p.type}) {p.in === "header" ? "[Header]" : ""}
                  </label>

                  {p?.required && 
                    <span
                      title={p?.requirementMsg ?? "This Field is required"}
                      className="field-required"
                    >
                      *
                    </span>
                  }

                  {
                    p.isObject ? 
                      <div className="editor-container">
                        {p.isObject && isThereJsonError && <small className="error-marker">• Syntax Error</small>}
                        {/* <textarea
                            className="form-input"
                            name={p.name}
                            value={inputValues[p.name]}
                            onChange={handleChange}
                            placeholder={JSON.stringify(p.example)}
                        /> */}
                        <Editor
                          // value={inputValues[p.name] || JSON.stringify(p?.example, null, 4)}
                          value={inputValues[p.name]}
                          onValueChange={code => handleChange(p.name, code)}
                          highlight={code => highlight(code, languages.json)}
                          padding={10}
                          className="code-editor"
                          title={p.objectStructure}
                        />
                      </div> :
                    p?.inputType ?
                      <input
                          type={p?.inputType || "text"}
                          className="form-input"
                          name={p.name}
                          value={inputValues[p.name]}
                          onChange={handleChange}
                          placeholder={p.example}
                      /> :
                      <select
                        name={p.name}
                        id={p.name}
                        className="form-select"
                        value={inputValues[p.name]}
                        onChange={handleChange}
                      >
                        <option value=""></option>
                        {p.options.map((option) => <option value={option}>{option}</option>)}
                      </select>
                  }
                </div>
              ))}

              {/* Submit Button */}
              <button 
                type="submit"
                className="btn btn-primary"
              >
                <div className={`spinner-container ${isLoading ? "" : "hidden"}`}>
                  <div className="spinner-border" role="status" style={{ width: 20, height: 20 }}>
                    <span className="visually-hidden"></span>
                  </div>
                </div>
                Try {endpoint.title}
              </button>

              {/* Errors */}
              {error && (
                <div className="error-container">
                  <span className="error">{error}</span>
                </div>
              )}
            </div>

            {/* Response */}
            {Object.keys(response).length > 0 && !error && (
              <div className="response-section" id="auth-api-response">
                <div className="response-header">
                  <strong>Response:</strong>
                  <span
                    className={`custom-button ${showResponse ? "clicked" : ""}`}
                    onClick={() => setShowResponse((prev) => !prev)}
                  >
                    {showResponse ? "On" : "Off"}
                  </span>
                </div>

                {showResponse && (
                  <div className="code-block">
                    <div className="code-header">
                      <span className="code-lang">JSON Response</span>
                      <button className="copy-btn" onClick={() => copy(responseStr)}>Copy</button>
                    </div>
                    <SyntaxHighlighter language="json" style={vscDarkPlus}>
                      {responseStr}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            )}
          </form>
        )}

        {/* --------------------- REQUEST TAB -------------------------- */}
        {activeTab === "request" && (
          <div className="tab-content active">

            {/* Headers */}
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">Headers</span>
                <button className="copy-btn" onClick={() => copy(headerCodeBlock)}>Copy</button>
              </div>
              <SyntaxHighlighter language="http" style={vscDarkPlus}>
                {headerCodeBlock}
              </SyntaxHighlighter>
            </div>

            {/* Request Body */}
            {endpoint.method.toLowerCase() !== "get" && (
              <div className="code-block">
                <div className="code-header">
                  <span className="code-lang">Request Body</span>
                  <button
                    className="copy-btn"
                    onClick={() => copy(JSON.stringify(requestBody, null, 4))}
                  >
                    Copy
                  </button>
                </div>
                <SyntaxHighlighter language="json" style={vscDarkPlus}>
                  {JSON.stringify(requestBody, null, 4)}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        )}

        {/* ------------------- RESPONSE TAB ---------------------------- */}
        {activeTab === "response" && (
          <div className="tab-content active">
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">JSON Response (200 OK)</span>
                <button className="copy-btn" onClick={() => copy(example)}>Copy</button>
              </div>
              <SyntaxHighlighter language="json" style={vscDarkPlus}>
                {example}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* ------------------- CODE TAB ------------------------------- */}
        {activeTab === "code" && (
          <div className="tab-content active">
            <div className="code-block">
              <div className="code-header">
                <span className="code-lang">JavaScript (fetch)</span>
                <button className="copy-btn" onClick={() => copy(codeContent)}>Copy</button>
              </div>
              <SyntaxHighlighter language="javascript" style={vscDarkPlus}>
                {codeContent}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        {/* ------------------- DETAILS TAB ---------------------------- */}
        {activeTab === "details" && (
          <div className="text-block active" style={{ marginTop: 40, marginBottom: 20 }}>
            <div className="text-header">Endpoint Description</div>
            <div className="text-content">{endpoint.details}</div>
            <div className="custom-link-container">
              {endpoint?.detail_link &&
                <a 
                  className="custom-link" 
                  href={`${endpoint.detail_link}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Click here for more details
                </a>
              }
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
