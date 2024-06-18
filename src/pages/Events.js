import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row } from 'react-bootstrap'; // CardColumns pour afficher les cartes d'événements en colonnes
import SideAd from '../images/side_ad.png';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import EventCards from '../components/EventCards';

function Events() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();




  useEffect(() => {
    axios.get("http://localhost:3002/")
        .then(res => {
            console.log(res.data);
            if (res.data.valid) {
                // Stocker l'ID utilisateur dans le sessionStorage
                sessionStorage.setItem('userId', res.data.id);
                navigate('/events');
                fetchEvents();
            } else {
                navigate('/login');
            }
        })
        .catch(err => {
            console.log(err);
            navigate('/login');
        });
}, [navigate]);

  const fetchEvents = () => {
    axios.get('http://localhost:3002/api/events')
      .then(response => {
        setEvents(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des événements :', error);
      });
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter(event => event.IDEVENT !== eventId));
  };

  return (
    <div className='main-margin'>
      <Row className="events">
        <Col>
          <div className='title'>
            <h1>Évènements</h1>
            <Link to="/calendar" className="add-button btn btn-primary">Ajouter un événement</Link>
          </div>
            {events.map(event => (
              <EventCards key={event.IDEVENT} event={event} onDelete={handleDeleteEvent} />
            ))}
          
        </Col>
        <Col xs lg="2">
          <img className="image_side" src={SideAd} alt="sideimage" />
        </Col>
      </Row>
    </div>
  );
}

export default Events;
