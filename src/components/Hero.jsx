import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

const Hero = ({ movie }) => {
    if (!movie) return null;

    return (
        <div style={styles.hero}>
            {/* Background Image with Gradient Overlay */}
            <div style={{
                ...styles.bgImage,
                backgroundImage: `url(${movie.cover})`
            }}>
                <div style={styles.gradient}></div>
            </div>

            <div style={styles.content}>
                <span style={styles.trendingTag}>Trending Now</span>
                <h1 style={styles.title}>{movie.name}</h1>
                <div style={styles.meta}>
                    <span style={styles.badge}>{movie.chapterCount} Episodes</span>
                </div>
                <div style={styles.actions}>
                    <Link to={`/detail/${movie.id}`} style={styles.playBtn}>
                        <Play size={20} fill="currentColor" />
                        <span>Play Now</span>
                    </Link>
                    <Link to={`/detail/${movie.id}`} style={styles.infoBtn}>
                        More Info
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    hero: {
        position: 'relative',
        height: '75vh',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        marginBottom: '60px',
        animation: 'fadeIn 1s ease-out',
    },
    bgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundSize: 'cover',
        backgroundPosition: 'top center',
        zIndex: -1,
    },
    gradient: {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to top, var(--background-color) 15%, rgba(15, 23, 42, 0.6) 50%, rgba(15, 23, 42, 0.2) 100%)',
    },
    content: {
        padding: '0 4% 80px 4%',
        width: '100%',
        maxWidth: '900px',
    },
    trendingTag: {
        color: 'var(--primary-color)',
        fontWeight: '700',
        textTransform: 'uppercase',
        fontSize: '0.85rem',
        letterSpacing: '2px',
        marginBottom: '16px',
        display: 'inline-block',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        padding: '6px 12px',
        borderRadius: '20px',
        border: '1px solid rgba(56, 189, 248, 0.2)',
    },
    title: {
        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
        fontWeight: '800',
        lineHeight: '1.1',
        marginBottom: '24px',
        textShadow: '0 4px 30px rgba(0,0,0,0.8)',
        letterSpacing: '-1px',
    },
    meta: {
        display: 'flex',
        gap: '15px',
        marginBottom: '32px',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        padding: '6px 14px',
        borderRadius: '8px',
        fontWeight: '500',
    },
    actions: {
        display: 'flex',
        gap: '20px',
        flexWrap: 'wrap',
    },
    playBtn: {
        backgroundColor: 'var(--primary-color)',
        color: '#fff',
        padding: '16px 40px',
        borderRadius: '50px',
        fontWeight: '700',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        transition: 'all 0.3s ease',
        border: 'none',
        boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
    },
    infoBtn: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        color: '#fff',
        padding: '16px 40px',
        borderRadius: '50px',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(255,255,255,0.1)',
    }
};

export default Hero;
