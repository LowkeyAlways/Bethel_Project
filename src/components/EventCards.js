import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link } from 'react-router-dom'; 


function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
}

function EventCards({ event, onDelete, userRole }) {
  const handleDelete = () => {
    if (userRole !== 1) {
        
        alert("Vous n'avez pas les autorisations nécessaires pour supprimer un article.");
        return;
      }
    axios.delete(`http://localhost:3002/api/events/delete/${event.IDEVENT}`)
      .then(response => {
        if (response.data.success) {
          onDelete(event.IDEVENT); 
          alert('Événement supprimé.');
        } else {
          alert('Erreur lors de la suppression de l\'événement');
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
      });
  };

  return (
    <Link to="/calendar" style={{ textDecoration: 'none' }}>
    <Card className='event_cards'>
      <Card.Body className='events_body'>
        <h5 className="card-title">{event.TITRE}</h5>
        <p>{truncateText(event.DESCRIPTION, 250)}</p>
        <p className="text-muted" style={{ fontSize: '0.9em' }}>
          Lieu: {event.LIEU} - {new Date(event.DATE_DEBUT).toLocaleDateString()} à {new Date(event.DATE_DEBUT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          <br />
          Durée: {calculateEventDuration(event.DATE_DEBUT, event.DATE_FIN)}
          <Button variant="danger" size="sm" className="mt-2" onClick={handleDelete}>Supprimer</Button>
        </p>
      </Card.Body>
    </Card>
    </Link>
  );
}


function calculateEventDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.abs(end - start);
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  return `${hours}h${minutes < 10 ? '0' : ''}${minutes}`;
}

export default EventCards;
