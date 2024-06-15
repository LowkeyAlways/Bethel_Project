import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../images/image_test.jpg';
import ImageSide from '../images/image_side.jpg';
import ArticleCards from '../components/ArticleCards';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [index, setIndex] = useState(0);
  const [articles, setArticles] = useState([]);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    axios.get('http://localhost:3002/api/articles')
      .then(response => {
        setArticles(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the articles!", error);
      });
  }, []);

  return (
    <div className='main-margin'>
      <Row className="article">
        {/* 1ère colonne */}
        <Col>
          <Carousel activeIndex={index} onSelect={handleSelect}>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={ExampleCarouselImage}
                alt="First slide"
              />
              <Carousel.Caption>
                <h3>First slide label</h3>
                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={ExampleCarouselImage}
                alt="Second slide"
              />
              <Carousel.Caption>
                <h3>Second slide label</h3>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src={ExampleCarouselImage}
                alt="Third slide"
              />
              <Carousel.Caption>
                <h3>Third slide label</h3>
                <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>
          <div className="container">
            <h2>Articles</h2>
            {articles.map(article => (
              <ArticleCards key={article.IDARTICLE} article={article} />
            ))}
          </div>
        </Col>
        {/* 2ème colonne */}
        <Col xs lg="2">
          <img className="image_side" src={ImageSide} alt="sideimage"></img>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
