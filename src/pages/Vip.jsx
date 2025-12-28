import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';

const Vip = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getVip();
                if (res.success && res.data && res.data.data && res.data.data.columnVoList) {
                    const columns = res.data.data.columnVoList;
                    // Flatten all books from all columns
                    const allBooks = columns.reduce((acc, col) => {
                        if (col.bookList) {
                            // Adapter for inconsistent naming: Vip API returns bookName, Home returned name. coverWap vs cover.
                            // I need to map them to the standard format for MovieCard.
                            const mapped = col.bookList.map(b => ({
                                id: b.bookId,
                                name: b.bookName,
                                cover: b.coverWap,
                                chapterCount: b.chapterCount
                            }));
                            return [...acc, ...mapped];
                        }
                        return acc;
                    }, []);
                    setMovies(allBooks);
                }
            } catch (error) {
                console.error("Failed to fetch VIP data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            <header style={styles.header}>
                <h1 className="section-title" style={{ color: '#fbbf24' }}>VIP Channel</h1>
            </header>

            {loading ? (
                <div className="flex-center" style={{ minHeight: '300px' }}>Loading...</div>
            ) : (
                <div style={styles.grid}>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    header: {
        marginTop: '30px',
        marginBottom: '20px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: '24px 16px',
    },
};

export default Vip;
