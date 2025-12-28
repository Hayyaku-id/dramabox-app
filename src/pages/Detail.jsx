import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import VideoPlayer from '../components/VideoPlayer';
import { Play } from 'lucide-react';
import './Detail.css';

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
            <div className="detail-layout">
                {/* Main Content: Player & Info */}
                <div className="detail-main">
                    {currentChapter ? (
                        <div style={{ marginBottom: '30px' }}>
                            <div className="player-wrapper">
                                {loadingVideo ? (
                                    <div className="placeholder-player">
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
                                    <div className="placeholder-player">Video failed to load or is VIP only.</div>
                                )}
                            </div>
                            <div style={{ marginTop: '20px' }}>
                                <h2 className="chapter-title">{fullTitle}</h2>
                                <p className="chapter-meta">Currently Playing: {episodeTitle}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="placeholder-player">Select an episode to play</div>
                    )}

                    <div className="info-box">
                        <h1 className="detail-title">{bookName}</h1>
                        <div className="tags">
                            {totalChapters && <span className="tag-badge">{totalChapters} Episodes</span>}
                            <span className="tag-badge">Drama</span>
                        </div>
                        <p className="description">{bookIntro}</p>
                    </div>
                </div>

                {/* Sidebar: Chapter Grid */}
                <div className="detail-sidebar">
                    <h3 className="sidebar-title">Episodes ({chapters.length})</h3>
                    <div className="chapter-grid">
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
                                    className={`chapter-box ${isSelected ? 'active' : ''}`}
                                >
                                    {cIndex + 1}
                                    {isVip && <span className="vip-dot">•</span>}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recommendations Section */}
            <div style={{ marginTop: '80px', paddingTop: '40px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <h2 className="section-title">You May Also Like</h2>
                <div className="rec-grid">
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
                                <h4 className="rec-title">{movie.name}</h4>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Detail;
