/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import validation from '../components/LoginValidation';
import { useNavigate } from 'react-router-dom';



function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate();
    const [errors, setErrors] = useState('')
    // eslint-disable-next-line no-unused-vars
    const handleInput = (e) => {
        setEmail(prev => ({...prev, [e.target.name]: e.target.value}))
    }
    axios.defaults.withCredentials = true;

    useEffect(() => {
      axios.get("http://localhost:3002/")
          .then(res => {
              console.log(res.data);
              if (!res.data.valid) {
                  navigate('/login');
              } else{
                    navigate('/');
                    
              }
          })
          .catch(err => {
              console.log(err);
              navigate('/login');
          });
  }, []);
  
      function handleSubmit(e){
        e.preventDefault();
        setErrors(validation(email, password))
        if(errors.email === "" && errors.password === ""){
            axios.post('http://localhost:3002/api/login', {email, password})
        .then(response => {
            navigate('/');
            window.location.reload();
        })
        .catch(error => {
            if (error.response && error.response.status === 401) {
                
                setErrors({ global: "Adresse e-mail ou mot de passe incorrect." });
            } else {
                console.log(error);
            }
        });
        }
        
    }
  return (
    <div className='d-flex vh-100 justify-content-center align-items-center'>
        <div className='login-form p-3 bg-white border rounded'>
            
            <legend className='text-center'>Connexion</legend>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder='nom@exemple.com' className='form-control' name='email'
                    onChange={e => setEmail(e.target.value)}></input>
                    {errors.email && <span className='text-danger'>{errors.email}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="password">Mot de Passe</label>
                    <input type="password" placeholder='************' className='form-control' name='password'
                    onChange={e => setPassword(e.target.value)}></input>
                    {errors.password && <span className='text-danger'>{errors.password}</span>}
                    <p>(8 caractères min., 1 chiffre obligatoire)</p>

                </div>
                <div className='d-flex justify-content-between'>
                <button type='submit' className='btn btn-primary'>Se connecter</button>
                <a href="/register" className='btn btn-link'>S'inscrire</a>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login;

