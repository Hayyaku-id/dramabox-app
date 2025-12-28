import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import { Play } from 'lucide-react';

const Detail = () => {
    const { id } = useParams();
    const [detail, setDetail] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [currentChapter, setCurrentChapter] = useState(null);
    const [videoUrl, setVideoUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            try {
                const detailRes = await api.getDetail(id);
                if (detailRes.success && detailRes.data) {
                    setDetail(detailRes.data);

                    // Use chapters from detail to get the full list
                    const fullChapters = detailRes.data.chapters || [];
                    setChapters(fullChapters);

                    if (fullChapters.length > 0) {
                        setCurrentChapter(fullChapters[0]);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch details", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id]);

    useEffect(() => {
        const fetchStream = async () => {
            if (!currentChapter) return;
            setLoadingVideo(true);
            setVideoUrl(null); // Reset while loading
            try {
                // Use index from the simplified chapter object
                const chapterIndex = currentChapter.index !== undefined ? currentChapter.index : currentChapter.chapterIndex;

                const res = await api.getStream(id, chapterIndex);
                if (res.status === 'success' && res.data && res.data.chapter && res.data.chapter.video) {
                    setVideoUrl(res.data.chapter.video.mp4 || res.data.chapter.video.m3u8);
                } else {
                    console.error("Stream not found or locked:", res);
                }
            } catch (error) {
                console.error("Failed to fetch stream", error);
            } finally {
                setLoadingVideo(false);
            }
        };

        fetchStream();
    }, [id, currentChapter]);

    // Fetch Recommendations
    useEffect(() => {
        const fetchRecommend = async () => {
            try {
                const res = await api.getRecommend();
                if (res.success && res.data) {
                    const recData = Array.isArray(res.data) ? res.data : (res.data.book || []);
                    setRecommendations(recData.map(b => ({
                        id: b.bookId || b.id,
                        name: b.bookName || b.name,
                        cover: b.coverWap || b.cover,
                        chapterCount: b.chapterCount
                    })));
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchRecommend();
    }, []);

    const handleChapterClick = (chapter) => {
        setCurrentChapter(chapter);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleVideoEnded = () => {
        if (!currentChapter || !chapters.length) return;

        // Simplify finding index based on structure
        const currentIndex = chapters.findIndex(c => (c.id === currentChapter.id) || (c.index === currentChapter.index));

        if (currentIndex !== -1 && currentIndex < chapters.length - 1) {
            const nextChapter = chapters[currentIndex + 1];
            // Small delay for UX
            setTimeout(() => {
                setCurrentChapter(nextChapter);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 500);
        }
    };

    if (loading) return <div className="container flex-center" style={{ height: '50vh', color: 'var(--text-secondary)' }}>Loading...</div>;
    if (!detail) return <div className="container flex-center" style={{ height: '50vh', color: 'var(--text-secondary)' }}>Drama not found.</div>;

    // Correctly map fields based on API structure found in probe
    // detail.drama contains { bookName, introduction, cover, chapterCount, etc }
    const bookInfo = detail.drama || detail.book || {};
    const bookName = bookInfo.bookName || bookInfo.name || "Unknown Title";
    const bookIntro = bookInfo.introduction || bookInfo.description || "No description available.";
    const bookCover = bookInfo.cover;
    const totalChapters = bookInfo.chapterCount || chapters.length;

    const currentIdx = currentChapter ? (currentChapter.index !== undefined ? currentChapter.index : currentChapter.chapterIndex) : 0;
    const episodeTitle = `Episode ${currentIdx + 1}`;
    const fullTitle = `${bookName} - ${episodeTitle}`;

    return (
        <div className="container" style={{ paddingBottom: '80px' }}>
            <div style={styles.layout}>
                {/* Main Content: Player & Info */}
                <div style={styles.main}>
                    {currentChapter ? (
                        <div style={{ marginBottom: '30px' }}>
                            <div style={styles.playerWrapper}>
                                {loadingVideo ? (
                                    <div style={styles.placeholderPlayer}>
                                        <div className="spinner"></div>
                                        <span style={{ marginTop: '15px' }}>Loading Stream...</span>
                                    </div>
                                ) : videoUrl ? (
                                    <VideoPlayer
                                        src={videoUrl}
                                        poster={bookCover}
                                        autoPlay={true}
                                        onEnded={handleVideoEnded}
                                    />
                                ) : (
                                    <div style={styles.placeholderPlayer}>Video failed to load or is VIP only.</div>
                                )}
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <h2 style={styles.chapterTitle}>{fullTitle}</h2>
                                <p style={styles.chapterMeta}>Currently Playing: {episodeTitle}</p>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.placeholderPlayer}>Select an episode to play</div>
                    )}

                    <div style={styles.infoBox}>
                        <h1 style={styles.title}>{bookName}</h1>
                        <div style={styles.tags}>
                            {totalChapters && <span style={styles.tagBadge}>{totalChapters} Episodes</span>}
                            <span style={styles.tagBadge}>Drama</span>
                        </div>
                        <p style={styles.desc}>{bookIntro}</p>
                    </div>
                </div>

                {/* Sidebar: Chapter Grid */}
                <div style={styles.sidebar}>
                    <h3 style={styles.sidebarTitle}>Episodes ({chapters.length})</h3>
                    <div style={styles.chapterGrid}>
                        {chapters.map((chapter, i) => {
                            // Unified check for selection
                            const cIndex = chapter.index !== undefined ? chapter.index : chapter.chapterIndex;
                            const isSelected = currentIdx === cIndex;

                            // Note: simpler objects might not have isCharge, assume free if missing or handle gracefully
                            const isVip = chapter.isCharge === 1;

                            return (
                                <button
                                    key={chapter.id || i}
                                    onClick={() => handleChapterClick(chapter)}
                                    style={{
                                        ...styles.chapterBox,
                                        backgroundColor: isSelected ? 'var(--primary-color)' : '#1e293b',
                                        color: isSelected ? '#fff' : 'var(--text-secondary)',
                                        border: isSelected ? 'none' : '1px solid #334155',
                                    }}
                                >
                                    {cIndex + 1}
                                    {isVip && <span style={styles.vipDot}>•</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 className="section-title">You May Also Like</h2>
                <div style={styles.recGrid}>
                    {recommendations.slice(0, 12).map(movie => (
                        <div key={movie.id} className="image-wrapper">
                            <a href={`/detail/${movie.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                                <div style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginBottom: '12px', position: 'relative' }}>
                                    <img src={movie.cover} alt={movie.name} className="image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                                    <div className="overlay" style={{
                                        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                                        background: 'rgba(0,0,0,0.3)', opacity: 0, transition: 'opacity 0.3s'
                                    }}>
                                        <Play size={40} className="flex-center" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: '#fff' }} />
                                    </div>
                                </div>
                                <h4 style={styles.recTitle}>{movie.name}</h4>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = {
    layout: {
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '40px',
        marginTop: '30px',
        '@media (max-width: 900px)': {
            gridTemplateColumns: '1fr',
        }
    },
    // Main
    main: {
        minWidth: 0, // Fix flex/grid overflow issue consistently
    },
    playerWrapper: {
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.5)',
    },
    placeholderPlayer: {
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#555',
        borderRadius: 'var(--radius-md)',
    },
    chapterTitle: {
        fontSize: '1.4rem',
        fontWeight: '600',
        color: 'var(--text-primary)',
        lineHeight: '1.4',
    },
    chapterMeta: {
        fontSize: '0.95rem',
        color: 'var(--primary-color)',
        marginTop: '8px',
        fontWeight: '500',
    },
    infoBox: {
        marginTop: '40px',
        padding: '30px',
        backgroundColor: 'var(--surface-color)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: '2.2rem',
        fontWeight: '700',
        marginBottom: '15px',
        color: '#fff',
    },
    tags: {
        display: 'flex',
        gap: '10px',
        marginBottom: '20px',
    },
    tagBadge: {
        fontSize: '0.85rem',
        padding: '4px 10px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '4px',
        color: '#ccc',
    },
    desc: {
        color: 'var(--text-secondary)',
        lineHeight: '1.7',
        fontSize: '1rem',
    },
    // Sidebar
    sidebar: {
        backgroundColor: 'var(--surface-color)',
        padding: '24px',
        borderRadius: 'var(--radius-md)',
        height: 'fit-content',
        maxHeight: '100vh',
        overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.05)',
    },
    sidebarTitle: {
        fontSize: '1.2rem',
        marginBottom: '20px',
        fontWeight: '600',
        color: 'var(--text-primary)',
    },
    chapterGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(50px, 1fr))',
        gap: '10px',
    },
    chapterBox: {
        aspectRatio: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
    },
    vipDot: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        color: '#fbbf24',
        fontSize: '1.5rem',
        lineHeight: 0,
    },
    // Recommendations
    recGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '24px',
        marginTop: '25px',
    },
    recTitle: {
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        marginTop: '10px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontWeight: '500',
    },
};

export default Detail;
