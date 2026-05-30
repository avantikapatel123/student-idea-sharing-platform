import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
    const navigate = useNavigate();
    return (
        <section className="Hero hero" id="hero">
            <h1>Turn Your Ideas Into Reality 💡</h1>
            <p>Share ideas with the world 🌐</p>
            <button id="get-started-btn" onClick={() => navigate('/dashboard')}>
                [ Get Started 🚀 ]
            </button>
        </section>
    );
}