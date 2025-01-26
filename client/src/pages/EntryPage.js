import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../EntryPage.css";

function EntryPage() {
    const { id } = useParams();
    const [entry, setEntry] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/flask-server/journal_logs.json") // Make sure Flask serves this correctly
            .then((response) => response.json())
            .then((data) => {
                const foundEntry = data.find((post) => String(post.id) === id);
                setEntry(foundEntry);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching JSON data:", error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <h2>Loading...</h2>;
    if (!entry) return <h2>Entry not found</h2>;

    return (
        <div className="entry-page">
            <h1>{new Date(entry.date).toLocaleDateString()} - {entry.time}</h1>
            <h2>{entry.summary}</h2>
            <p className="entry-mood">Mood: {entry.mood}</p>

            <div className="entry-content-box">
                {entry.conversation && entry.conversation.map((line, index) => (
                    <p key={index}>{line}</p>
                ))}
            </div>
        </div>
    );
}

export default EntryPage;

