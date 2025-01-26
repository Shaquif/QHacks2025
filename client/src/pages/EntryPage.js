import React from 'react';
import { useParams } from 'react-router-dom';
import Data from '../entries.json';

function EntryPage() {
  const { id } = useParams();
  const entry = Data.find((post) => post.id === parseInt(id));

  if (!entry) {
    return <h2>Entry not found</h2>;
  }

  return (
    <div className="entry-page">
      <h1>{entry.date}</h1>
      <h2>{entry.title}</h2>
      <p>{entry.content}</p>
    </div>
  );
}

export default EntryPage;
