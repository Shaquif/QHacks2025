import React from 'react';
import { useParams } from 'react-router-dom';
import Data from '../entries.json'; // Make sure this file exists
import '../EntryPage.css'; // Ensure correct import path

function EntryPage() {
  const { id } = useParams();
  const entry = Data.find((post) => post.id === Number(id));

  if (!entry) {
    return <h2>Entry not found</h2>;
  }

  return (
    <div className="entry-page">
      <h1>{entry.date}</h1>
      <h2>{entry.title}</h2>
      <div className="entry-content-box">
        <p>{entry.content}</p>
      </div>
    </div>
  );
}

export default EntryPage;