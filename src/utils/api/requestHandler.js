/**
 * Effectue une requête GET pour récupérer des ressources depuis une API.
 * @param {string} url - L'URL de l'API.
 * @param {Object} [options={}] - Options supplémentaires pour fetch.
 * @returns {Promise<any>} - Les données récupérées.
 */
export async function getResource(url, options = {}) {
  // Validation de l'URL
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("L'URL est vide ou invalide");
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Ajout d'un en-tête par défaut
        ...options.headers, // Permettre la surcharge des en-têtes
      },
      ...options, // Conserver les autres options (comme credentials)
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP ${response.status}: ${response.statusText} pour l'URL ${url}`);
    }

    // Vérifier si la réponse a un contenu
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("La réponse n'est pas au format JSON");
    }

    return await response.json();
  } catch (error) {
    // Ajouter plus de contexte à l'erreur
    throw new Error(`Erreur lors de la récupération des données: ${error.message}`);
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
    throw new Error("L'URL est vide ou invalide");
  }
  if (typeof data !== "object" || data === null) {
    throw new Error("Les données doivent être un objet non nul");
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
    throw new Error(`Erreur lors de l'envoi des données: ${error.message}`);
  }
}