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
            <h1>{entry.date}</h1>
            <h2>Summary: {entry.summary}</h2>
            <p className="entry-sentiment">Mood: {entry.sentiment}</p>
            <div className="entry-content-box">
                {entry.conversation.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
}

export default EntryPage;