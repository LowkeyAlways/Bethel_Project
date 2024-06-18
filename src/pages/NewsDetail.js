import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';

function NewsDetail(userRole) {
  const { newsId } = useParams();
  const [news, setNews] = useState(null);

  useEffect(() => {
    
    const fetchNews = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/news/${newsId}`);
        setNews(response.data); 
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'actualité:', error);
      }
    };

    fetchNews(); 
  }, [newsId]);

  const handleDelete = () => {
    if (userRole !== 1) {
        
        alert("Vous n'avez pas les autorisations nécessaires pour supprimer un article.");
        return;
      }
    axios.delete(`http://localhost:3002/api/news/delete/${newsId}`)
      .then(response => {
        if (response.data.success) {
          alert('Actualité supprimée avec succès.');
          
        } else {
          alert('Erreur lors de la suppression de l\'actualité.');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  if (!news) {
    return <p>Chargement en cours...</p>; 
  }

  return (
    <div className='main-margin'>
      <div className='actualite_cards'>
        <div className='actualite_details'>
          <h5 className="card-title">{news.TITRE}</h5>
          <div
            className='actualite_content'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.DESCRIPTION) }} 
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
