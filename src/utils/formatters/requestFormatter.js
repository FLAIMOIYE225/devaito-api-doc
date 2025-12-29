/* ---------------------------------------------- Construire l'url ----------------------------------- */

/**
 * @param {string} url
 */
// Fonction pour parser et remplacer les placeholders dans l'URL
const parseUrl = (url, values) => {
    let parsedUrl = url;
    const placeholders = url.match(/{[^{}]+}/g) || []; // Trouver tous les {placeholder}
    placeholders.forEach((placeholder) => {
        const key = placeholder.slice(1, -1); // Enlever les {}
        const value = values[key] || ""; // Récupérer la valeur ou "" si non définie
        if (value){
            parsedUrl = parsedUrl.replace(placeholder, encodeURIComponent(value));            
        } else {
            parsedUrl = parsedUrl.replace(placeholder + '/', encodeURIComponent(value))
        }
    });
    return parsedUrl;
};

const buildObject = (parameters, values = {}, target="") => {
  // Validation des entrées
  if (!Array.isArray(parameters)) {
    throw new Error("Les paramètres doivent être un tableau");
  }
  if (typeof values !== "object" || values === null) {
    throw new Error("Les valeurs doivent être un objet non nul");
  }

  return parameters.reduce((body, parameter) => {
    if (parameter.in === target) {
      // Vérifier que parameter.name existe
      if (!parameter.name) {
        throw new Error("Un paramètre n'a pas de propriété 'name'");
      }
      // Utiliser une valeur par défaut si values[parameter.name] est undefined
      body[parameter.name] = values[parameter.name] ?? null;
    }
    return body;
  }, {});
};

/**
 * Constructs a complete URL with query parameters.
 * 
 * @function buildUrl
 * @param {string} url - The base URL to build upon
 * @param {string[]} [parameters=[]] - Array of parameter names to extract from values
 * @param {*} values - Object or array containing the values to map to parameters
 * @returns {string} The complete URL with query parameters as a string
 * 
 * @example
 * // Returns: "https://example.com?name=John&age=30"
 * buildUrl("https://example.com", ["name", "age"], { name: "John", age: 30 })
 * 
 * @description
 * This function builds a URL by:
 * 1. Converting parameters and values into a query object using buildObject()
 * 2. Creating a URL object from the provided base URL
 * 3. Adding each parameter as a search parameter to the URL
 * 4. Returning the complete URL as a string
 */
function buildUrl(url, parameters=[], values) {
  const params = buildObject(parameters, values, "query")

  // Crée un objet URL à partir de la chaîne
  const urlObj = new URL(url);

  // Parcourt les clés de l'objet
  Object.keys(params).forEach(key => {
    // Remplace la valeur du paramètre dans l'URL
    urlObj.searchParams.set(key, params[key]);
  });

  // Retourne l'URL finale sous forme de string
  return urlObj.toString();
}

/* -------------------------------------------- Construire le body ----------------------------------------- */

/**
 * Construit le corps d'une requête POST à partir des paramètres et des valeurs saisies.
 * @param {Array<{ name: string, in: string, type: string, example?: string, required?: boolean }>} parameters - Les paramètres de l'endpoint.
 * @param {Object} values - Les valeurs des champs saisis par l'utilisateur.
 * @returns {Object} - Le corps de la requête formaté pour les paramètres avec in: "body".
 * @throws {Error} - Si les paramètres ou les valeurs sont invalides.
 */
const buildRequestBody = (parameters, values = {}) => {
  values = {...values}
  // Validation des entrées
  if (!Array.isArray(parameters)) {
    throw new Error("Les paramètres doivent être un tableau");
  }
  if (typeof values !== "object" || values === null) {
    throw new Error("Les valeurs doivent être un objet non nul");
  }

  return parameters.reduce((body, parameter) => {
    if (parameter.in === "body") {
      // Vérifier que parameter.name existe
      if (!parameter.name) {
        throw new Error("Un paramètre n'a pas de propriété 'name'");
      }
      if (!values[parameter.name]) return body
      // Utiliser une valeur par défaut si values[parameter.name] est undefined
      if (parameter?.isObject && values[parameter.name]) {
        body[parameter.name] = JSON.parse(values[parameter.name]) ?? null;
      } 
      else if (parameter.type === "integer") {
        body[parameter.name] = Number.parseInt(values[parameter.name]) ?? null;
      }
      // else if (parameter.isObject && !values[parameter.name]) {
      //   if (parameter.type==="Array") body[parameter.name] = [];
      //   if (parameter.type==="Object") body[parameter.name] = parameter.example;
      // } 
      else body[parameter.name] = values[parameter.name] ?? null;

      // if (!values[parameter.name] && typeof values[parameter.name] != "boolean" ) body[parameter.name] = null
    }
    return body;
  }, {});
};

export {parseUrl, buildRequestBody, buildObject, buildUrl}