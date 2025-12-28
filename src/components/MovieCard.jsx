import React from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';

const MovieCard = ({ movie }) => {
    return (
        <Link to={`/detail/${movie.id}`} style={styles.card}>
            <div style={styles.imageWrapper} className="image-wrapper">
                <img src={movie.cover} alt={movie.name} style={styles.image} loading="lazy" />
                <div style={styles.overlay} className="overlay">
                    <PlayCircle size={48} color="#fff" fill="var(--primary-color)" />
                </div>
                <div style={styles.badge}>{movie.chapterCount} Eps</div>
            </div>
            <div style={styles.content}>
                <h3 style={styles.title}>{movie.name}</h3>
            </div>
        </Link>
    );
};

const styles = {
    card: {
        display: 'block',
        transition: 'transform 0.3s ease',
    },
    imageWrapper: {
        position: 'relative',
        aspectRatio: '2/3',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        backgroundColor: '#222',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    badge: {
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: '600',
    },
    content: {
        marginTop: '10px',
    },
    title: {
        fontSize: '0.95rem',
        fontWeight: '500',
        color: 'var(--text-primary)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

// Add hover effect via global style or simple inline style injection for completeness?
// React inline styles for hover are tricky. I'll rely on a small class in index.css for the hover specific that is hard to do inline.
// I'll add "image-wrapper" class logic in index.css for hover scale.

export default MovieCard;
