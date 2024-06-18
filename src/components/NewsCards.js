import React from 'react';
import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'; // Importez Link depuis react-router-dom
import axios from 'axios';

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function NewsCard({ news, onDelete, userRole }) {
  const handleDelete = () => {
    if (userRole !== 1) {
      // Si l'utilisateur n'a pas le rôle approprié (ROLE=1), afficher une alerte
      alert("Vous n'avez pas les autorisations nécessaires pour supprimer une actualité.");
      return;
    }
    axios.delete(`http://localhost:3002/api/news/${news.IDACTUALITE}`)
      .then(response => {
        if (response.data.success) {
          onDelete(news.IDACTUALITE);
          alert('Actualité supprimée.');
        } else {
          alert('Erreur lors de la suppression de l\'actualité');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'actualité');
      });
  };

  return (
    <Link to={`/news/${news.IDACTUALITE}`} style={{ textDecoration: 'none' }}>
    <Card className='news_card'>   
      <Card.Body>
          <h5 className="card-title">{news.TITRE}</h5>
        <p className='news_text'>{truncateText(news.DESCRIPTION, 100)}</p>
        <p className="text-muted" style={{ fontSize: '0.9em' }}>
          Par {news.AUTEUR} - {new Date(news.DATE).toLocaleDateString()}{' '}
          <button className="delete_button btn btn-sm btn-danger" onClick={handleDelete}>Supprimer</button>
        </p>
      </Card.Body>
    </Card>
    </Link>
    
  );
}

export default NewsCard;
