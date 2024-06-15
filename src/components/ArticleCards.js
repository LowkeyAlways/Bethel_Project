import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import DOMPurify from 'dompurify';
import axios from 'axios';

// Truncate text utility function
function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function ArticleCards({ article, onDelete }) {
  const handleDelete = () => {
    axios.delete(`http://localhost:3002/api/article/delete/${article.IDARTICLE}`)
      .then(response => {
        if (response.data.success) {
          onDelete(article.IDARTICLE); // Appeler la fonction onDelete pour supprimer l'article du state parent
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
    <Card className='article_cards'>
      <Card.Body>
        <h5 className="card-title">{article.TITRE}</h5>
        <div
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateText(article.CONTENU, 250)) }}
        />
        <p className="text-muted" style={{ fontSize: '0.9em' }}>
          Par {article.AUTEUR} - {new Date(article.DATE).toLocaleDateString()}
          <Button variant="danger" size="sm" className="ms-2" onClick={handleDelete}>Supprimer</Button>
        </p>
      </Card.Body>
    </Card>
  );
}

export default ArticleCards;
