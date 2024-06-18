import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AjouterChant() {
  const [titre, setTitre] = useState('');
  const [paroles, setParoles] = useState('');
  const [compositeur, setCompositeur] = useState('');
  const [createur, setCreateur] = useState('');
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
      alert('Vous devez être connecté pour ajouter un chant');
      return;
    }

    axios.post('http://localhost:3002/api/songs', { userId, titre, paroles, compositeur, createur })
      .then(response => {
        if (response.data.success) {
          navigate('/songs');
        } else {
          alert('Erreur lors de la création du chant');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <div className='main-margin'>
      <h1>Ajouter un chant</h1>
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
              <label className="form-label">Paroles</label>
              <textarea
                className="form-control"
                value={paroles}
                onChange={(e) => setParoles(e.target.value)}
                required
              ></textarea>
            </div>
            
            <div className="mb-3">
              <label className="form-label">Compositeur</label>
              <input
                type="text"
                className="form-control"
                value={compositeur}
                onChange={(e) => setCompositeur(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Createur</label>
              <input
                type="text"
                className="form-control"
                value={createur}
                onChange={(e) => setCreateur(e.target.value)}
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

export default AjouterChant;
