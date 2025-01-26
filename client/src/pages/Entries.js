import '../entries.css';
import React from 'react';
import Data from '../entries.json';
import { useNavigate } from 'react-router-dom';
import paperIcon from '../Images/paper.png';  // Import the image correctly

function Entries() {
  const navigate = useNavigate();

  const handleEntryClick = (entryId) => {
    navigate(`/entry/${entryId}`); // Navigate to specific entry
  };

  return (
    <div className="entries-container">
      <h1>Your Journal Entries</h1>

      <div className="button-container">
        {Data.map((entry) => (
          <button
            key={entry.id}
            className="entry-button"
            onClick={() => handleEntryClick(entry.id)}
          >
            <img src={paperIcon} alt="icon" className="entry-icon" />
            <p className="entry-date">{entry.date}</p> {/* Display Date */}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Entries;
