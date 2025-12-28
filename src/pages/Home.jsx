import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import Hero from '../components/Hero';
import Section from '../components/Section';

const Home = () => {
    const [content, setContent] = useState({
        latest: [],
        vip: [],
        dubbed: [],
        recommend: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Parallel fetching
                const [homeRes, vipRes, dubbedRes, recRes] = await Promise.all([
                    api.getHome(),
                    api.getVip(),
                    api.getDubbed(),
                    api.getRecommend()
                ]);

                // Extract Latest
                const latest = (homeRes.success && homeRes.data && homeRes.data.book) ? homeRes.data.book : [];

                // Extract VIP (Flattened)
                let vip = [];
                if (vipRes.success && vipRes.data && vipRes.data.data && vipRes.data.data.columnVoList) {
                    vip = vipRes.data.data.columnVoList.reduce((acc, col) => {
                        if (col.bookList) {
                            return [...acc, ...col.bookList.map(b => ({
                                id: b.bookId,
                                name: b.bookName,
                                cover: b.coverWap,
                                chapterCount: b.chapterCount
                            }))];
                        }
                        return acc;
                    }, []);
                }

                // Extract Dubbed
                let dubbed = [];
                if (dubbedRes.success && dubbedRes.data && dubbedRes.data.data && dubbedRes.data.data.classifyBookList) {
                    const records = dubbedRes.data.data.classifyBookList.records || [];
                    dubbed = records.map(b => ({
                        id: b.bookId,
                        name: b.bookName,
                        cover: b.coverWap,
                        chapterCount: b.chapterCount
                    }));
                }

                // Extract Recommend
                let recommend = [];
                if (recRes.success && recRes.data) {
                    const recData = Array.isArray(recRes.data) ? recRes.data : (recRes.data.book || []);
                    recommend = recData.map(b => ({
                        id: b.bookId || b.id,
                        name: b.bookName || b.name,
                        cover: b.coverWap || b.cover,
                        chapterCount: b.chapterCount
                    }));
                }

                setContent({ latest, vip, dubbed, recommend });

            } catch (err) {
                console.error("Aggregation Error", err);
                setError("Failed to load some content.");
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    // Select a featured movie (first of latest, or random)
    const featuredMovie = content.latest.length > 0 ? content.latest[0] : null;

    if (loading) return <div className="flex-center" style={{ height: '100vh' }}>Loading...</div>;

    return (
        <div style={{ paddingBottom: '80px', minHeight: '100vh' }}>
            {featuredMovie && <Hero movie={featuredMovie} />}

            <div className="container">
                <Section title="Latest Dramas" movies={content.latest} link="/search?q=" />
                <Section title="VIP Channel" movies={content.vip} link="/vip" />
                <Section title="Dubbed in Bahasa" movies={content.dubbed} link="/dubbed" />
                <Section title="Recommended for You" movies={content.recommend} />
            </div>
        </div>
    );
};

export default Home;
