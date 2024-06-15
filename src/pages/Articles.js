import React, { useState, useEffect } from 'react';
import ArticleCards from '../components/ArticleCards';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import ImageSide from '../images/image_side.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = () => {
    axios.get('http://localhost:3002/api/articles')
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the articles!", error);
      });
  };

  const handleDelete = (articleId) => {
    setArticles(articles.filter(article => article.IDARTICLE !== articleId));
  };

  return (
    <div className='main-margin'>
      <Row className="articles">
        <Col>
          <div className='title'>
            <h1>Articles</h1>
            <Link to="/ajouterarticle" className="add-button btn btn-primary">Ajoutez un article</Link>
          </div>
          {articles.map(article => (
            <ArticleCards key={article.IDARTICLE} article={article} onDelete={handleDelete} />
          ))}
        </Col>
        <Col xs lg="2">
          <img className="image_side" src={ImageSide} alt="sideimage" />
        </Col>
      </Row>
    </div>
  );
}

export default Articles;
