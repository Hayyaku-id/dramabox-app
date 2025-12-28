import React from 'react';
import MovieCard from './MovieCard';

const Section = ({ title, movies, link }) => {
    if (!movies || movies.length === 0) return null;

    return (
        <section style={styles.section}>
            <div style={styles.header}>
                <div style={styles.titleWrapper}>
                    <div style={styles.accentBar}></div>
                    <h2 style={styles.title}>{title}</h2>
                </div>
                {link && <a href={link} style={styles.moreLink}>See All</a>}
            </div>
            <div style={styles.scrollContainer}>
                <div style={styles.list}>
                    {movies.map(movie => (
                        <div key={movie.id} style={styles.cardWrapper}>
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const styles = {
    section: {
        marginBottom: '40px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        padding: '0 4%',
    },
    titleWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    accentBar: {
        width: '4px',
        height: '24px',
        backgroundColor: 'var(--primary-color)',
        borderRadius: '2px',
    },
    title: {
        fontSize: '1.4rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    moreLink: {
        color: 'var(--primary-color)',
        fontSize: '0.9rem',
        fontWeight: '500',
    },
    scrollContainer: {
        overflowX: 'auto',
        paddingBottom: '20px',
        scrollbarWidth: 'none', /* Firefox */
        msOverflowStyle: 'none',  /* IE 10+ */
        paddingLeft: '4%',
    },
    list: {
        display: 'flex',
        gap: '16px',
        width: 'max-content',
    },
    cardWrapper: {
        width: '160px',
        flexShrink: 0,
    }
};

export default Section;
