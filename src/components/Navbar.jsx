import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Navbar = () => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const [isFocused, setIsFocused] = useState(false);

    return (
        <nav style={styles.nav}>
            <div className="container" style={styles.container}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                    <Link to="/" style={styles.logo}>DRAMABOX</Link>
                    <div style={styles.links}>
                        <Link to="/vip" style={styles.link}>VIP</Link>
                        <Link to="/dubbed" style={styles.link}>Dubbed</Link>
                        <Link to="/categories" style={styles.link}>Categories</Link>
                    </div>
                </div>
                <form onSubmit={handleSearch} style={styles.searchForm}>
                    <div style={{
                        ...styles.inputWrapper,
                        borderColor: isFocused ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                        backgroundColor: isFocused ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)',
                        width: isFocused ? '105%' : '100%',
                    }}>
                        <Search size={18} color={isFocused ? 'var(--primary-color)' : '#94a3b8'} />
                        <input
                            type="text"
                            placeholder="Search dramas..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            style={styles.input}
                        />
                    </div>
                </form>
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        height: 'var(--header-height)',
        position: 'sticky',
        top: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.85)', // Slate 900 with opacity
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        margin: '0 auto',
        padding: '0 4%',
    },
    logo: {
        fontSize: '1.8rem',
        fontWeight: '900',
        background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--primary-color) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        letterSpacing: '-1px',
    },
    searchForm: {
        width: '100%',
        maxWidth: '350px',
        display: 'flex',
        justifyContent: 'flex-end',
    },
    inputWrapper: {
        display: 'flex',
        alignItems: 'center',
        padding: '12px 24px',
        borderRadius: '50px',
        borderWidth: '1px',
        borderStyle: 'solid',
        transition: 'all 0.3s ease',
    },
    input: {
        background: 'transparent',
        border: 'none',
        color: 'var(--text-primary)',
        marginLeft: '12px',
        outline: 'none',
        width: '100%',
        fontSize: '0.95rem',
        fontWeight: '500',
    },
    links: {
        display: 'flex',
        gap: '32px',
        display: 'none', // Hidden on small screens normally, but keeping as is for now
    },
    link: {
        color: 'var(--text-secondary)',
        fontWeight: '500',
        fontSize: '0.95rem',
        transition: 'color 0.2s',
    },
};
// Responsive links override
styles.links = {
    display: 'flex',
    gap: '30px',
};

export default Navbar;
