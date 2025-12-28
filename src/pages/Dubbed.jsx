import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';

const Dubbed = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getDubbed();
                if (res.success && res.data && res.data.data && res.data.data.classifyBookList) {
                    const records = res.data.data.classifyBookList.records || [];
                    const mapped = records.map(b => ({
                        id: b.bookId,
                        name: b.bookName,
                        cover: b.coverWap,
                        chapterCount: b.chapterCount
                    }));
                    setMovies(mapped);
                }
            } catch (error) {
                console.error("Failed to fetch Dubbed data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            <header style={styles.header}>
                <h1 className="section-title">Dubbed Dramas</h1>
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

export default Dubbed;
