import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
            setIsMenuOpen(false); // Close menu on search
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="nav-container">
                <div className="nav-left">
                    {/* Mobile Toggle */}
                    <button className="mobile-toggle" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    <Link to="/" className="nav-logo" onClick={closeMenu}>DRAMABOX</Link>

                    {/* Desktop Links */}
                    <div className="nav-links">
                        <Link to="/vip" className="nav-link">VIP</Link>
                        <Link to="/dubbed" className="nav-link">Dubbed</Link>
                        <Link to="/categories" className="nav-link">Categories</Link>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="search-form">
                    <div className={`search-wrapper ${isFocused ? 'focused' : ''}`}>
                        <Search size={18} color={isFocused ? 'var(--primary-color)' : '#94a3b8'} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            className="search-input"
                        />
                    </div>
                </form>

                {/* Mobile Menu Dropdown */}
                {isMenuOpen && (
                    <div className="nav-mobile-menu">
                        <Link to="/vip" className="nav-link" onClick={closeMenu}>VIP Channel</Link>
                        <Link to="/dubbed" className="nav-link" onClick={closeMenu}>Dubbed in Bahasa</Link>
                        <Link to="/categories" className="nav-link" onClick={closeMenu}>Browse Categories</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
