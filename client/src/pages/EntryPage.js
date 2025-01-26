import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../EntryPage.css';

function EntryPage() {
    const { id } = useParams();
    const [entry, setEntry] = useState(null);

    useEffect(() => {
        fetch('/flask-server/journal_logs.json')
            .then(response => response.json())
            .then(data => {
                const foundEntry = data.find((post) => post.id === Number(id));
                setEntry(foundEntry);
            })
            .catch(error => console.error('Error fetching JSON data:', error));
    }, [id]);

    if (!entry) {
        return <h2>Entry not found</h2>;
    }

    return (
        <div className="entry-page">
            <h1 className="h1Entry">Entry Page: #{entry.id}</h1>
            <h1>{entry.date}</h1>

            {/* Entry Content Box Now Includes Summary */}
            <div className="entry-content-box">
                <h2>Summary:</h2>
                <p>{entry.summary}</p>

                <h2>Mood:</h2>
                <p>{entry.sentiment}</p>

                <h2>Full Conversation:</h2>
                {entry.conversation.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
}

export default EntryPage;