import '../entries.css';
import React from 'react';
import Data from '../entries.json';
import { useNavigate } from 'react-router-dom';

function FetchData() {
  const navigate = useNavigate();

  const handleEntryClick = (entryId) => {
    navigate(`/entry/${entryId}`);
  };

  return (
    <div className="entries-container">
      <h1>Your Journal Entries</h1>

      <div className="entry-card">
        <h3>January 24, 2025</h3>
        <p>Had a great day walking in the park.</p>
      </div>

      <div className="button-container">
        {Data.map((entry) => (
          <button
            key={entry.id}
            className="entry-button"
            onClick={() => handleEntryClick(entry.id)}
          >
            <img src="client/src/images/paper.png" alt="icon" />
            {entry.date}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FetchData;
