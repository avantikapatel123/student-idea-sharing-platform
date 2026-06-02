import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <span>IdeaHub </span>
            </div>
            <ul className="nav-links">
                <li>
                    <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#16A34A' : 'white', fontWeight: isActive ? '700' : '500' })}>
                        Home ⾕
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard" style={({ isActive }) => ({ color: isActive ? '#16A34A' : 'white', fontWeight: isActive ? '700' : '500' })}>
                        Explore જ⁀➴
                    </NavLink>
                </li>
                <li>
                    <button className="add-idea-btn" onClick={() => navigate('/idea/new')}>
                        [ ༒︎ Add Idea ]
                    </button>
                </li>
            </ul>
        </nav>
    );
}