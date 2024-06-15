 /* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav, Navbar, NavDropdown, Container } from "react-bootstrap";
import logo from "../images/logo.png";


function Header() {
  const [username, setUsername] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [id, setId] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3002/")
      .then((res) => {
        console.log(res.data); 
        if (res.data.valid) {
          setUsername(res.data.username);
          setId(res.data.id);
        } else {
          setUsername(""); 
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleLogout = () => {
    axios.post("http://localhost:3002/api/logout")
      .then((res) => {
        window.location.reload(); 
      })
      .catch((err) => console.log(err));
  };
  axios.defaults.withCredentials = true;
  return (
    <div>
    <Navbar expand="lg">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="navbar_menu mr-auto">
            <div className="first-link">
            <Nav.Link className="nav-link" href="/">Accueil</Nav.Link>
            <Nav.Link className="nav-link" href="/news">Actualités</Nav.Link>
            <Nav.Link className="nav-link" href="/articles">Articles</Nav.Link>
            </div>
            
          </Nav>
          <Nav>
          <Navbar.Brand href="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Navbar.Brand>
          </Nav>
          <Nav>
          <div className="second-link">
          <Nav.Link className="nav-link" href="/songs">Chants</Nav.Link>
            <Nav.Link className="nav-link" href="/events">Évènements</Nav.Link>
            <Nav.Link className="nav-link" href="/calendar">Calendrier</Nav.Link>
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
        {username ? (
              <div className="nav_login" onClick={handleLogout}>Déconnexion</div>
            ) : (
              <div>
                <a className="nav_login" href="/login">Se connecter</a>
              </div>
            )}
    </div>
  );
}

export default Header;
