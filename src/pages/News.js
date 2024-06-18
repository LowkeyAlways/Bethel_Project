import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import SideAd from '../images/side_ad.png';
import NewsCard from '../components/NewsCards';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';


function News() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = () => {
    axios.get('http://localhost:3002/api/news')
      .then(response => {
        setNews(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the news!", error);
      });
  };

  const handleDelete = (newsId) => {
    setNews(news.filter(newsItem => newsItem.IDACTUALITE !== newsId));
  };

  return (
    <div className='main-margin'>
      <Row className="news">
        <Col>
          <div className='title'>
            <h1>Actualités</h1>
            <Link to="/ajouternews" className="add-button btn btn-primary">Ajoutez une actualité</Link>
          </div>
          <div className='news_content'>
            {news.map(newsItem => (
              <NewsCard key={newsItem.IDACTUALITE} news={newsItem} onDelete={handleDelete} />
            ))}
          </div>
        </Col>
        <Col xs lg="2">
          <img className="image_side" src={SideAd} alt="sideimage" />
        </Col>
      </Row>
    </div>
  );
}

export default News;
