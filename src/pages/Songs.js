import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Button, Alert } from 'react-bootstrap';
import SideAd from '../images/side_ad.png';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';


function Songs() {
  const [songs, setSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [lyrics, setLyrics] = useState('');
  const [editedLyrics, setEditedLyrics] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3002/api/songs')
      .then(response => {
        const sortedSongs = response.data.sort((a, b) => a.TITRE.localeCompare(b.TITRE));
        setSongs(sortedSongs);
      })
      .catch(error => {
        console.error("There was an error fetching the songs!", error);
      });
  }, []);

  const handleSelectChange = (e) => {
    const songId = e.target.value;
    if (songId === "") {
      setSelectedSong(null);
      setLyrics('');
      setEditedLyrics('');
      setMessage('');
      return;
    }
    axios.get(`http://localhost:3002/api/songs/${songId}`)
      .then(response => {
        setSelectedSong(response.data);
        setLyrics(response.data.PAROLES);
        setEditedLyrics(response.data.PAROLES);
        setMessage(''); 
      })
      .catch(error => {
        console.error("There was an error fetching the song lyrics!", error);
      });
  };

  const handleQuillChange = (content, delta, source, editor) => {
    setEditedLyrics(content);
  };

  const handleSaveChanges = () => {
    if (selectedSong) {
      axios.post(`http://localhost:3002/api/songs/update/${selectedSong.IDCHANT}`, {
        PAROLES: editedLyrics,
      })
        .then(response => {
          console.log("Lyrics updated successfully!");
          setLyrics(editedLyrics);
          setMessage('Modifications enregistrées.'); 
        })
        .catch(error => {
          console.error("There was an error updating the lyrics!", error);
          setMessage('Erreur lors de l\'enregistrement des modifications.'); 
        });
    }
  };

  return (
    <div className='main-margin'>
      <Row className="songs">
        <Col className='d-flex flex-row '>
          <div className='songs_choice'>
            <h1>Sélectionner un chant :</h1>
            <Form.Select className="form-select form-select-sm" aria-label="select" onChange={handleSelectChange} value={selectedSong ? selectedSong.IDCHANT : ''}>
              <option value="">Liste des chants</option>
              {songs.map((song) => (
                <option key={song.IDCHANT} value={song.IDCHANT}>
                  {song.TITRE}
                </option>
              ))}
            </Form.Select>
            <Button className='save_button' variant="primary" onClick={handleSaveChanges}>Enregistrer les modifications</Button>
            {message && <Alert className='save_message' variant={message.includes('Erreur') ? 'danger' : 'success'}>{message}</Alert>}
            <Link to="/ajouterchant" className="add-songs btn btn-primary">Ajouter un chant</Link>
          </div>
          <div className='text-content'>
            {selectedSong && (
              <div>
                <h2>{selectedSong.TITRE}</h2>
                <ReactQuill
                  className='text-editor'
                  value={editedLyrics}
                  onChange={handleQuillChange}
                  theme="snow"
                />
              </div>
            )}
          </div>
        </Col>
        <Col xs lg="2">
          <img className="image_side" src={SideAd} alt="sideimage"></img>
        </Col>
      </Row>
    </div>
  );
}

export default Songs;
