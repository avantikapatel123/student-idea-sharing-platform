import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { IdeaProvider, useIdeas } from './context/IdeaContext';
import Navbar from './components/Navbar';
import Loader from './components/Loader';
import Toast from './components/Toast';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import IdeaForm from './pages/IdeaForm';

function AppContent() {
    const { loading, setLoading } = useIdeas();

    useEffect(() => {
       
        const timer = setTimeout(() => setLoading(false), 450); 
        return () => clearTimeout(timer);
    }, [setLoading]);

    if (loading) return <Loader />;

    return (
        <Router>
            <Navbar />
            <main className="main-container">
                <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/idea/new" element={<IdeaForm />} />
                    <Route path="/idea/:id/edit" element={<IdeaForm />} />
                </Routes>
            </main>
            <footer className="footer-container">
                <p>&copy; 2026 Student Idea Platform. All rights reserved.</p>
                <ul>
                    <li><a href="#about">About 📋</a></li>
                    <li><a href="#contact">Contact ☏</a></li>
                    <li><a href="#social">Social links 🔗</a></li>
                </ul>
            </footer>
            <Toast />
        </Router>
    );
}

export default function App() {
    return (
        <IdeaProvider>
            <AppContent />
        </IdeaProvider>
    );
}