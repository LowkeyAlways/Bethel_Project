/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import validation from '../components/SignupValidation';
import { useNavigate } from 'react-router-dom';

function Subscription() {
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [emailExists, setEmailExists] = useState(false);

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get("http://localhost:3002/")
            .then(res => {
                console.log(res.data);
                if (res.data.valid) {
                    navigate('/');
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/login');
            });
    }, []);

    const handleInput = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validation(values.email, values.password, values.firstname, values.lastname);

        
        if (Object.values(formErrors).some(error => error !== '')) {
            setErrors(formErrors);
            console.log('Il y a des erreurs de validation');
            return;
        }

        axios.post('http://localhost:3002/api/check-email', { email: values.email })
            .then(res => {
                const { exists } = res.data;
                if (exists) {
                    setEmailExists(true);
                } else {
                    axios.post('http://localhost:3002/api/register', values)
                        .then(res => {
                            console.log(res);
                            navigate('/login');
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='d-flex vh-100 justify-content-center align-items-center'>
            <div className='login-form p-3 bg-white border rounded'>
                <legend className='text-center'>Inscription</legend>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email">Prénom</label>
                        <input type="name" placeholder='Prénom' className='form-control' name='firstname'
                            onChange={handleInput}></input>
                        {errors.firstname && <span className='text-danger'>{errors.firstname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email">Nom</label>
                        <input type="name" placeholder='Nom' className='form-control' name='lastname'
                            onChange={handleInput}></input>
                        {errors.lastname && <span className='text-danger'>{errors.lastname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='nom@exemple.com' className='form-control' name='email'
                            onChange={handleInput}></input>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                        {emailExists && <span className="text-danger">Cet email est déjà utilisé.</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password">Mot de Passe</label>
                        <input type="password" placeholder='************' className='form-control' name='password'
                            onChange={handleInput}></input>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                        <p>(8 caractères min., 1 chiffre obligatoire)</p>
                    </div>
                    <button type='submit' className='btn btn-primary'>S'inscrire</button>
                </form>
            </div>
        </div>
    )
}

export default Subscription;
