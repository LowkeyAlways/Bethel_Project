import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AjouterArticle() {
  const [titre, setTitre] = useState('');
  const [contenu, setContenu] = useState('');
  const [auteur, setAuteur] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3002/")
      .then(res => {
        if (!res.data.valid) {
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

    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      alert('Vous devez être connecté pour ajouter un article');
      return;
    }

    axios.post('http://localhost:3002/api/article', { userId, titre, contenu, auteur })
      .then(response => {
        if (response.data.success) {
          navigate('/articles');
        } else {
          alert('Erreur lors de la création de l\'article');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <div className='main-margin'>
        <h1>Ajouter un article</h1>
      <div className='ajouter_article'>
        <div className='article-form'>
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
            <button type="submit" className="btn btn-primary">Ajouter</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AjouterArticle;
