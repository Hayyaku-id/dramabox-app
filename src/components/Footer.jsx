import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p style={styles.text}>Made by Hayyaku</p>
        </footer>
    );
};

const styles = {
    footer: {
        padding: '20px',
        textAlign: 'center',
        backgroundColor: 'var(--surface-color)', // Matching the dark theme
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        marginTop: 'auto', // Pushes it to the bottom if using flex column
        width: '100%',
    },
    text: {
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        margin: 0,
    }
};

export default Footer;
