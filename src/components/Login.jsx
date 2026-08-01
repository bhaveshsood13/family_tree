import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (userId.toLowerCase() === 'sood' && password.toLowerCase() === 'family') {
            onLogin();
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass-panel">
                <div className="login-header">
                    <h1>Sood Family Tree</h1>
                    <p>Enter your credentials to view the legacy.</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="input-group">
                        <User className="input-icon" size={20} />
                        <input
                            type="text"
                            placeholder="User ID"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn">
                        Enter Tree
                    </button>
                </form>
            </div>

            <style jsx>{`
                .login-container {
                    width: 100vw;
                    height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #f1f5f9;
                    background-image: radial-gradient(circle at 2px 2px, #cbd5e1 1px, transparent 0);
                    background-size: 24px 24px;
                }

                .login-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    width: 100%;
                    max-width: 400px;
                    border: 1px solid rgba(255,255,255,0.5);
                    text-align: center;
                }

                .login-header h1 {
                    margin: 0 0 8px 0;
                    color: #1e293b;
                    font-size: 28px;
                    font-weight: 800;
                }

                .login-header p {
                    margin: 0 0 32px 0;
                    color: #64748b;
                    font-size: 14px;
                }

                .login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .input-group {
                    position: relative;
                }

                .input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                }

                .input-group input {
                    width: 100%;
                    padding: 12px 16px 12px 42px;
                    border: 2px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 15px;
                    outline: none;
                    transition: all 0.2s;
                    background: white;
                    color: #1e293b;
                }

                .input-group input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
                }

                .error-message {
                    color: #ef4444;
                    font-size: 13px;
                    font-weight: 500;
                    background: #fef2f2;
                    padding: 8px;
                    border-radius: 8px;
                }

                .login-btn {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    color: white;
                    border: none;
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    margin-top: 8px;
                    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
                }

                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
                }
            `}</style>
        </div>
    );
};

export default Login;
