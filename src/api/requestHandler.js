import axios from 'axios';

/**
 * Effectue une requête GET pour récupérer des ressources depuis une API.
 * @param {string} url - L'URL de l'API.
 * @param {Object} [options={}] - Options supplémentaires pour axios.
 * @returns {Promise<any>} - Les données récupérées.
 */
export async function getResource(url, options = {}) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("URL is empty or invalid");
  }

  try {
    const response = await axios.get(url, {
      headers: options.headers || {},
      ...options,
    });

    return response.data;
  } catch (error) {
    throw new Error(`Error retrieving data: ${error.message}`);
  }
}

/**
 * Effectue une requête POST pour envoyer des données à une API.
 * @param {string} url - L'URL de l'API.
 * @param {Object} data - Les données à envoyer dans le corps de la requête.
 * @param {Object} [options={}] - Options supplémentaires pour axios.
 * @returns {Promise<any>} - Les données JSON de la réponse.
 */
export async function postResource(url, data, options = {}) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("URL is empty or invalid");
  }
  if (typeof data !== "object" || data === null) {
    throw new Error("Data must be a non-null object");
  }

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...Object.fromEntries(
        Object.entries(options).filter(([key]) => key !== "method")
      ),
    });
    return response.data;
  } catch (error) {
    if ([500, 404].includes(error.status) && !error.response.data.succes) 
      return error.response.data  // Normalement je n'est pas à faire ça mais, le serveur renvoie une erreur 500
                                  // ... alors que la rêquêtte à bien été traité. 
                                  // Voir avec Medhi si c'est possible de changer le status code dans le cas de figure 
                                  // ... suivant: "/make-payement" -> {success: False, "This payment method is not supported yet.Cash On Delivery"}
    
    throw new Error(`Error sending data: ${error.message}`);
  }
}

/**
 * Effectue une requête HTTP avec une méthode personnalisée et un corps optionnel.
 * @param {string} url - L'URL de l'API.
 * @param {string} method - La méthode HTTP à utiliser.
 * @param {Object} [body] - Les données à envoyer dans le corps.
 * @param {Object} [options={}] - Options supplémentaires pour axios.
 * @returns {Promise<any>} - Les données JSON de la réponse.
 */
export async function requestResource(url, method, body, options = {}) {
  if (!url || typeof url !== "string" || url.trim() === "") {
    throw new Error("L'URL est vide ou invalide");
  }
  if (!method || typeof method !== "string") {
    throw new Error("La méthode HTTP est invalide");
  }

  try {
    const axiosOptions = {
      method: method.toUpperCase(),
      url,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...Object.fromEntries(
        Object.entries(options).filter(([key]) => key !== "method" && key !== "body")
      ),
    };

    if (body !== undefined && ["POST", "PUT", "PATCH", "DELETE"].includes(axiosOptions.method)) {
      axiosOptions.data = body;
    }

    const response = await axios(axiosOptions);
    return response.data;
  } catch (error) {
    throw new Error(`Erreur lors de la requête ${method}: ${error.message}`);
  }
}
