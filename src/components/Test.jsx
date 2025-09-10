import React, { useState } from 'react';

function Formulaire() {
  // État pour stocker les valeurs des inputs
  const [valeurs, setValeurs] = useState({
    nom: '',
    email: '',
    commentaire: '',
  });

  // Gestionnaire de changement pour les inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValeurs((prev) => ({
      ...prev, // Conserver les autres valeurs
      [name]: value, // Mettre à jour la valeur correspondante
    }));
  };

  // Gestionnaire de soumission du formulaire (optionnel)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Valeurs soumises:', valeurs);
  };

  return (
    <div className="main-content" style={{ marginBottom: '20px' }}>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nom">Nom :</label>
          <input
            type="text"
            name="nom"
            value={valeurs.nom}
            onChange={handleChange}
            placeholder="Entrez votre nom"
          />
        </div>
        <div>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            name="email"
            value={valeurs.email}
            onChange={handleChange}
            placeholder="Entrez votre email"
          />
        </div>
        <div>
          <label htmlFor="commentaire">Commentaire :</label>
          <textarea
            name="commentaire"
            value={valeurs.commentaire}
            onChange={handleChange}
            placeholder="Entrez un commentaire"
          />
        </div>
        <button type="submit">Soumettre</button>
      </form>
      <div>
        <h3>Valeurs actuelles :</h3>
        <pre>{JSON.stringify(valeurs, null, 2)}</pre>
      </div>
    </div>
  );
}

export default Formulaire;