import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.getCategories();
                if (res.success && res.data) {
                    // Check structure of categories
                    setCategories(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="container" style={{ paddingBottom: '50px' }}>
            <header style={styles.header}>
                <h1 className="section-title">Categories</h1>
            </header>

            {loading ? (
                <div className="flex-center" style={{ minHeight: '300px' }}>Loading...</div>
            ) : (
                <div style={styles.grid}>
                    {categories.map((cat) => (
                        <Link to={`/category/${cat.id}`} key={cat.id} style={styles.card}>
                            <span style={styles.name}>{cat.name}</span>
                        </Link>
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
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '16px',
    },
    card: {
        backgroundColor: '#1f1f1f',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        textAlign: 'center',
        transition: 'background 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #333',
    },
    name: {
        fontWeight: '600',
        fontSize: '1rem',
    }
};

export default Categories;
