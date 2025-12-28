import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import MovieCard from '../components/MovieCard';

const CategoryDetail = () => {
    const { id } = useParams();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.getCategory(id);
                if (res.success && res.data) {
                    const list = Array.isArray(res.data) ? res.data : (res.data.book || []);
                    setMovies(list);
                }
            } catch (error) {
                console.error("Failed to fetch Category data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            <header style={styles.header}>
                <h1 className="section-title">Category Results</h1>
            </header>

            {loading ? (
                <div className="flex-center" style={{ minHeight: '300px' }}>Loading...</div>
            ) : (
                <div style={styles.grid}>
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                    {movies.length === 0 && <p>No dramas found in this category.</p>}
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

export default CategoryDetail;
