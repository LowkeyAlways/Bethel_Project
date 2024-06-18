import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ModifierActualite({ news, setEditingNews }) {
  const [titre, setTitre] = useState(news.TITRE);
  const [contenu, setContenu] = useState(news.CONTENU);
  const [auteur, setAuteur] = useState(news.AUTEUR);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Vous devez être connecté pour modifier une actualité');
      return;
    }

    axios.put(`http://localhost:3002/api/news/${news.IDACTUALITE}`, { userId, titre, contenu, auteur })
      .then(response => {
        if (response.data.success) {
          setEditingNews(null); // Réinitialiser l'état de modification
          alert('Actualité modifiée avec succès');
        } else {
          alert('Erreur lors de la modification de l\'actualité');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <div className='modifier_actualite'>
      <h5>Modifier l'actualité</h5>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Titre</label>
          <input
            type="text"
            className="form-control"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contenu</label>
          <textarea
            className="form-control"
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Auteur</label>
          <input
            type="text"
            className="form-control"
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Enregistrer les modifications</button>
      </form>
    </div>
  );
}

export default ModifierActualite;
