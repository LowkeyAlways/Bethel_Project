import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';

function ArticleDetail({userRole}) {
  const { articleId } = useParams(); 
  const [article, setArticle] = useState(null);

  useEffect(() => {
    
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/article/${articleId}`);
        setArticle(response.data); 
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
      }
    };

    fetchArticle(); 
  }, [articleId]);

  const handleDelete = () => {
    if (userRole !== 1) {
        
        alert("Vous n'avez pas les autorisations nécessaires pour supprimer un article.");
        return;
      }
    axios.delete(`http://localhost:3002/api/article/delete/${articleId}`)
      .then(response => {
        if (response.data.success) {
          alert('Article supprimé avec succès.');
          
        } else {
          alert('Erreur lors de la suppression de l\'article.');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  if (!article) {
    return <p>Chargement en cours...</p>; 
  }

  return (
    <div className='main-margin'>
      <div className='article_cards'>
        <div className='article_details'>
          <h5 className="card-title">{article.TITRE}</h5>
          <div
            className='article_content'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.CONTENU) }} 
          />
          <p className="text-muted" style={{ fontSize: '0.9em' }}>
            Par {article.AUTEUR} - {new Date(article.DATE).toLocaleDateString()}
            <Button variant="danger" size="sm" className="ms-2" onClick={handleDelete}>Supprimer</Button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ArticleDetail;
