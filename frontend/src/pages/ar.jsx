import React, { useEffect, useState } from 'react';

const EmbedPage = () => {
    const [embeds, setEmbeds] = useState([]);

    useEffect(() => {
        const fetchEmbeds = async () => {
            try {
                const response = await fetch('api/getar');
                const data = await response.json();
                setEmbeds(data.embeds || []);
            } catch (error) {
                console.error('Error fetching embed links:', error);
            }
        };

        fetchEmbeds();
    }, []);

    return (
        <div style={styles.container}>
            <h1>AR Lenses Embeds</h1>
            <div style={styles.embedContainer}>
                {embeds.map((embedHtml, index) => (
                    <div
                        key={index}
                        style={styles.embedWrapper}
                        dangerouslySetInnerHTML={{ __html: embedHtml }}
                    />
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        textAlign: 'center',
    },
    embedContainer: {
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        flexWrap: 'wrap', // Ensures responsive design
    },
    embedWrapper: {
        width: '416px',
        height: '692px',
        border: '1px solid #ccc',
        borderRadius: '10px',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
};

export default EmbedPage;
