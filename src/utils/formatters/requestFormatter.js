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


/* -------------------------------------------- Construire le body ----------------------------------------- */

/**
 * Construit le corps d'une requête POST à partir des paramètres et des valeurs saisies.
 * @param {Array<{ name: string, in: string, type: string, example?: string, required?: boolean }>} parameters - Les paramètres de l'endpoint.
 * @param {Object} values - Les valeurs des champs saisis par l'utilisateur.
 * @returns {Object} - Le corps de la requête formaté pour les paramètres avec in: "body".
 * @throws {Error} - Si les paramètres ou les valeurs sont invalides.
 */
const buildRequestBody = (parameters, values = {}) => {
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
      // Utiliser une valeur par défaut si values[parameter.name] est undefined
      body[parameter.name] = values[parameter.name] ?? null;
    }
    return body;
  }, {});
};

export {parseUrl, buildRequestBody}