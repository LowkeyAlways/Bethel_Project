import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AjouterNews() {
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [auteur, setAuteur] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    axios.get("http://localhost:3002/")
      .then(res => {
        if (res.data.valid) {
          // Stocker l'ID utilisateur dans le sessionStorage
          sessionStorage.setItem('userId', res.data.id);
        } else {
            navigate('/login');
        }
      })
      .catch(err => {
        console.log(err);
        navigate('/login');
      });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Récupérer l'ID de l'utilisateur du sessionStorage
    const userId = sessionStorage.getItem('userId');
    
    if (!userId) {
      alert('Vous devez être connecté pour ajouter une actualité');
      return;
    }

    axios.post('http://localhost:3002/api/news', { userId, titre, description, auteur })
      .then(response => {
        if (response.data.success) {
            navigate('/news');
        } else {
          alert('Erreur lors de la création de l\'actualité');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <div className='main-margin'>
        <div className='ajouter_news'>
        <h1>Ajouter une actualité</h1>
        <div className='news-form'>
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
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
          <button type="submit" className="btn btn-primary">Ajouter</button>
        </form>
        </div>
        
      </div>
        </div>
    
  );
}

export default AjouterNews;
