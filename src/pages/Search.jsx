import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (query) {
            const doSearch = async () => {
                setLoading(true);
                try {
                    const res = await api.getSearch(query);
                    if (res.success && res.data) {
                        const searchResults = res.data.book || res.data || [];
                        setMovies(searchResults.map(b => ({
                            id: b.bookId || b.id,
                            name: b.bookName || b.name,
                            cover: b.coverWap || b.cover,
                            chapterCount: b.chapterCount
                        })));
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            };
            doSearch();
        }
    }, [query]);

    return (
        <div className="container" style={{ paddingBottom: '80px', minHeight: '80vh' }}>
            <header style={{ marginTop: '40px', marginBottom: '30px' }}>
                <h1 className="section-title" style={{ fontSize: '2rem' }}>Result for "{query}"</h1>
            </header>
            {loading ? (
                <div style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Searching...</div>
            ) : (
                <>
                    <div style={styles.grid}>
                        {movies.map(movie => (
                            <div key={movie.id} style={styles.cardWrapper}>
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>
                    {movies.length === 0 && (
                        <div style={styles.emptyState}>
                            <p>No results found for "{query}".</p>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px' }}>Try searching with a different keyword.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

const styles = {
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '30px 20px',
    },
    cardWrapper: {
        width: '100%',
    },
    emptyState: {
        textAlign: 'center',
        marginTop: '100px',
        fontSize: '1.2rem',
        color: 'var(--text-primary)',
    }
};

export default SearchPage;
