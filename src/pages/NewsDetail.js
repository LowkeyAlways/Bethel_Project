import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';

function NewsDetail(userRole) {
  const { newsId } = useParams(); // Récupère l'ID de l'actualité depuis l'URL
  const [news, setNews] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les détails de l'actualité depuis l'API
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/news/${newsId}`);
        setNews(response.data); // Met à jour l'état avec les détails de l'actualité récupérés
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'actualité:', error);
      }
    };

    fetchNews(); // Appel de la fonction pour récupérer les détails de l'actualité
  }, [newsId]);

  const handleDelete = () => {
    if (userRole !== 1) {
        // Si l'utilisateur n'a pas le rôle approprié (ROLE=1), afficher une alerte
        alert("Vous n'avez pas les autorisations nécessaires pour supprimer un article.");
        return;
      }
    axios.delete(`http://localhost:3002/api/news/delete/${newsId}`)
      .then(response => {
        if (response.data.success) {
          alert('Actualité supprimée avec succès.');
          // Redirection vers la liste des actualités ou une autre page appropriée après suppression
        } else {
          alert('Erreur lors de la suppression de l\'actualité.');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  if (!news) {
    return <p>Chargement en cours...</p>; // Affiche un message de chargement tant que l'actualité n'est pas chargée
  }

  return (
    <div className='main-margin'>
      <div className='actualite_cards'>
        <div className='actualite_details'>
          <h5 className="card-title">{news.TITRE}</h5>
          <div
            className='actualite_content'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.DESCRIPTION) }} // Utilisation de DOMPurify pour nettoyer et afficher le contenu HTML en toute sécurité
          />
          <p className="text-muted" style={{ fontSize: '0.9em' }}>
            Par {news.AUTEUR} - {new Date(news.DATE).toLocaleDateString()}
            <Button variant="danger" size="sm" className="ms-2" onClick={handleDelete}>Supprimer</Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NewsDetail;
