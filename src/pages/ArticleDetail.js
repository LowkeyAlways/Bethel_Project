import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DOMPurify from 'dompurify';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Button } from 'react-bootstrap';

function ArticleDetail({userRole}) {
  const { articleId } = useParams(); // Récupère l'ID de l'article depuis l'URL
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Fonction pour récupérer les détails de l'article depuis l'API
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:3002/api/article/${articleId}`);
        setArticle(response.data); // Met à jour l'état avec les détails de l'article récupérés
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'article:', error);
      }
    };

    fetchArticle(); // Appel de la fonction pour récupérer les détails de l'article
  }, [articleId]);

  const handleDelete = () => {
    if (userRole !== 1) {
        // Si l'utilisateur n'a pas le rôle approprié (ROLE=1), afficher une alerte
        alert("Vous n'avez pas les autorisations nécessaires pour supprimer un article.");
        return;
      }
    axios.delete(`http://localhost:3002/api/article/delete/${articleId}`)
      .then(response => {
        if (response.data.success) {
          alert('Article supprimé avec succès.');
          // Redirection vers la liste des articles ou une autre page appropriée après suppression
        } else {
          alert('Erreur lors de la suppression de l\'article.');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  if (!article) {
    return <p>Chargement en cours...</p>; // Affiche un message de chargement tant que l'article n'est pas chargé
  }

  return (
    <div className='main-margin'>
      <div className='article_cards'>
        <div className='article_details'>
          <h5 className="card-title">{article.TITRE}</h5>
          <div
            className='article_content'
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.CONTENU) }} // Utilisation de DOMPurify pour nettoyer et afficher le contenu HTML en toute sécurité
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
