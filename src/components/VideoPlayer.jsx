import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ src, poster, autoPlay = false, onEnded }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Cleanup previous listeners if any (though mostly handled by effect re-run)
        const handleEnded = () => {
            if (onEnded) onEnded();
        };
        video.addEventListener('ended', handleEnded);

        if (Hls.isSupported() && src && src.endsWith('.m3u8')) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (autoPlay) video.play();
            });
            return () => {
                video.removeEventListener('ended', handleEnded);
                hls.destroy();
            };
        } else if (video.canPlayType('application/vnd.apple.mpegurl') && src && src.endsWith('.m3u8')) {
            // Native HLS support (Safari)
            video.src = src;
            if (autoPlay) video.play();
        } else {
            // Standard MP4 or other native formats
            video.src = src;
            if (autoPlay) video.play();
        }

        return () => {
            video.removeEventListener('ended', handleEnded);
        };
    }, [src, autoPlay, onEnded]);

    return (
        <div style={styles.wrapper}>
            <video
                ref={videoRef}
                controls
                poster={poster}
                style={styles.video}
                className="video-player"
                playsInline
            />
        </div>
    );
};

const styles = {
    wrapper: {
        width: '100%',
        aspectRatio: '16/9',
        backgroundColor: '#000',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    },
    video: {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
    },
};

export default VideoPlayer;
