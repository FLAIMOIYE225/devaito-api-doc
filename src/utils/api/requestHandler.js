/**
 * Effectue une requête GET pour récupérer des ressources depuis une API.
 * @param {string} url - L'URL de l'API.
 * @param {Object} [options={}] - Options supplémentaires pour fetch.
 * @returns {Promise<any>} - Les données récupérées.
 */
export async function getResource(url, options = {}) {
  // Validation de l'URL
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("URL is empty or invalid");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        // "Accept": "application/json", // Ajout d'un en-tête par défaut
        ...options.headers, // Permettre la surcharge des en-têtes
      },
      ...options, // Conserver les autres options (comme credentials)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} pour l'URL ${url}`);
    }

    // Vérifier si la réponse a un contenu
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La réponse n'est pas au format JSON");
    }

    return await response.json();
  } catch (error) {
    // Ajouter plus de contexte à l'erreur
    throw new Error(`Error retrieving data: ${error.message}`);
  }
}


/**
 * Effectue une requête POST pour envoyer des données à une API.
 * @param {string} url - L'URL de l'API.
 * @param {Object} data - Les données à envoyer dans le corps de la requête.
 * @param {Object} [options={}] - Options supplémentaires pour fetch (en-têtes, credentials, etc.).
 * @returns {Promise<any>} - Les données JSON de la réponse.
 * @throws {Error} - Si la requête échoue ou si la réponse n'est pas au format JSON.
 */
export async function postResource(url, data, options = {}) {
  // Validation des entrées
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("URL is empty or invalid");
  }
  if (typeof data !== "object" || data === null) {
    throw new Error("Data must be a non-null object");
  }

  try {
    const response = await fetch(url, {
      method: "POST", // Forcer la méthode POST
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      body: JSON.stringify(data),
      // Exclure method des options pour éviter de surcharger POST
      ...Object.fromEntries(
        Object.entries(options).filter(([key]) => key !== "method")
      ),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} pour l'URL ${url}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La réponse n'est pas au format JSON");
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Error sending data: ${error.message}`);
  }
}

/**
 * Effectue une requête HTTP avec une méthode personnalisée et un corps optionnel.
 * @param {string} url - L'URL de l'API.
 * @param {string} method - La méthode HTTP à utiliser (GET, POST, PUT, DELETE, etc.).
 * @param {Object} [body] - Les données à envoyer dans le corps de la requête (optionnel).
 * @param {Object} [options={}] - Options supplémentaires pour fetch.
 * @returns {Promise<any>} - Les données JSON de la réponse.
 * @throws {Error} - Si la requête échoue ou si la réponse n'est pas au format JSON.
 */
export async function requestResource(url, method, body, options = {}) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("L'URL est vide ou invalide");
  }
  if (!method || typeof method !== "string") {
    throw new Error("La méthode HTTP est invalide");
  }

  try {
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...Object.fromEntries(
        Object.entries(options).filter(([key]) => key !== "method" && key !== "body")
      ),
    };

    // Ajouter le corps uniquement pour les méthodes qui l'acceptent
    if (body !== undefined && ["POST", "PUT", "PATCH", "DELETE"].includes(fetchOptions.method)) {
      fetchOptions.body = JSON.stringify(body);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} pour l'URL ${url}`);
    }

    const contentType = response.headers.get("Content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La réponse n'est pas au format JSON");
    }

    return await response.json();
  } catch (error) {
    throw new Error(`Erreur lors de la requête ${method}: ${error.message}`);
  }
}