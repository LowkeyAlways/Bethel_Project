import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import DOMPurify from 'dompurify';
import axios from 'axios';
import { Link } from 'react-router-dom'; 


function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function ArticleCards({ article, onDelete, userRole }) {
  const handleDelete = () => {
    if (userRole !== 1) {
      
      alert("Vous n'avez pas les autorisations nécessaires pour supprimer un article.");
      return;
    }
    axios.delete(`http://localhost:3002/api/article/delete/${article.IDARTICLE}`)
      .then(response => {
        if (response.data.success) {
          onDelete(article.IDARTICLE); 
          alert('Actualité supprimée.');
        } else {
          alert('Erreur lors de la suppression de l\'article');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <Link to={`/article/${article.IDARTICLE}`} style={{ textDecoration: 'none' }}>
      <Card className='article_cards' style={{ cursor: 'pointer' }}>
        <Card.Body>
          <h5 className="card-title">{article.TITRE}</h5>
          <div className='article_content'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(article.CONTENU, 250)) }}
          />
          <p className="text-muted" style={{ fontSize: '0.9em' }}>
            Par {article.AUTEUR} - {new Date(article.DATE).toLocaleDateString()}
            <Button variant="danger" size="sm" className="ms-2" onClick={handleDelete}>Supprimer</Button>
          </p>
        </Card.Body>
      </Card>
    </Link>
  );
}

export default ArticleCards;
