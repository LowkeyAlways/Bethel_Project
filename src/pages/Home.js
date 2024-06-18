import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import ArticleCards from '../components/ArticleCards';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import SideAd from '../images/side_ad.png';
import BackgroundImg from '../images/background_image.png';

function Home() {
  const [index, setIndex] = useState(0);
  const [articles, setArticles] = useState([]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

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

  return (
    <div className='main-margin'>
      <Row className="article">
        {/* 1ère colonne */}
        <Col>
          <Carousel activeIndex={index} onSelect={handleSelect}>
            {articles.map(article => (
              <Carousel.Item key={article.IDARTICLE}>
                <img
                  className="d-block w-100"
                  src={BackgroundImg}
                  alt={article.TITRE}
                />
                <Carousel.Caption>
                  <h3>{article.TITRE}</h3>
                  <p>{article.DESCRIPTION}</p>
                  <p>Par {article.AUTEUR} - {new Date(article.DATE).toLocaleDateString()}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
          <div className="container">
            <h2>Articles</h2>
            {articles.map(article => (
              <ArticleCards key={article.IDARTICLE} article={article} />
            ))}
          </div>
        </Col>
        {/* 2ème colonne */}
        <Col className='side_container' xs lg="2">
          <img className="image_side" src={SideAd} alt="sideimage"></img>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
