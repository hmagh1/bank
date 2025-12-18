import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import Alert from '../../components/Alert';
import './Auth.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [identityNumber, setIdentityNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 4) {
            setError('Le mot de passe doit contenir au moins 4 caractères');
            return;
        }

        setLoading(true);

        try {
            await authService.registerSelf({
                username: email,       // login = email
                email: email,
                identityNumber,
                password
            });

            setSuccess('Compte créé avec succès ! Redirection...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du compte');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1 className="auth-logo">🏦</h1>
                    <h2 className="auth-title">E-Bank</h2>
                    <p className="auth-subtitle">Créer un compte client</p>
                </div>

                <Alert type="error" message={error} onClose={() => setError('')} />
                <Alert type="success" message={success} />

                <form onSubmit={handleSubmit} className="auth-form">

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="email@exemple.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>CIN</label>
                        <input
                            type="text"
                            value={identityNumber}
                            onChange={(e) => setIdentityNumber(e.target.value)}
                            placeholder="CIN123456"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirmer mot de passe</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>Déjà un compte ?</p>
                    <Link to="/login" className="auth-link">Se connecter</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
