import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:5000/adminStatus', formData);
            
            if (response.status === 200) {
                
                navigate('/adminDashboard');
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data.message || 'Invalid credentials');
                console.error('Login failed with response:', error.response.data);
            } else if (error.request) {
                setError('No response from server');
                console.error('Login failed with request:', error.request);
            } else {
                setError('Error: ' + error.message);
                console.error('Login error:', error.message);
            }
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#222831',
        }}>
            <div style={{
                backgroundColor: '#393E46',
                padding: '3rem',
                borderRadius: '8px',
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                maxWidth: '32rem',
                width: '100%',
            }}>
                <h2 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: '#FFD369',
                    marginBottom: '2rem',
                    textAlign: 'center',
                }}>
                    Admin Login
                </h2>

                {error && (
                    <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #FFD369',
                        backgroundColor: '#222831',
                        color: '#EEEEEE',
                        fontSize: '1.25rem',
                        outline: 'none',
                        boxShadow: '0 0 0 2px transparent',
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #FFD369')}
                    onBlur={(e) => (e.target.style.boxShadow = '0 0 0 2px transparent')}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        borderRadius: '8px',
                        border: '1px solid #FFD369',
                        backgroundColor: '#222831',
                        color: '#EEEEEE',
                        fontSize: '1.25rem',
                        outline: 'none',
                        boxShadow: '0 0 0 2px transparent',
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = '0 0 0 2px #FFD369')}
                    onBlur={(e) => (e.target.style.boxShadow = '0 0 0 2px transparent')}
                />

                <button
                    onClick={handleLogin}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        backgroundColor: '#FFD369',
                        color: '#222831',
                        fontWeight: 'bold',
                        fontSize: '1.25rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                    }}
                >
                    Login
                </button>
            </div>
        </div>
    );
};

export default AdminLogin;
