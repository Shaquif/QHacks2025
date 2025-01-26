import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import paperIcon from '../Images/paper.png';
import '../entries.css';

function Entries() {
    const [entries, setEntries] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('/flask-server/journal_logs.json')
            .then(response => response.json())
            .then(data => setEntries(data))
            .catch(error => console.error('Error fetching JSON data:', error));
    }, []);

    const handleEntryClick = (entryId) => {
        navigate(`/entry/${entryId}`);
    };

    const handleNewEntryClick = () => {
        navigate('/entry/new'); // Navigate to new entry creation page
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="entries-container">
            <h1 className="entries-title">Journal Entries</h1>
            <div className="entries-grid">
                {entries.map((entry, index) => (
                    <button
                        key={entry.id}
                        className={`entry-card entry-color-${index % 5}`}
                        onClick={() => handleEntryClick(entry.id)}
                    >
                        <img src={paperIcon} alt="icon" className="entry-icon" />
                        <p className="entry-date"><strong>{formatDate(entry.date)}</strong></p>
                    </button>
                ))}
                
                {/* New Entry Button */}
                <button
                    className="entry-card new-entry-card"
                    onClick={handleNewEntryClick}
                >
                    <span className="new-entry-plus">+</span>
                </button>
            </div>
        </div>
    );
}

export default Entries;
