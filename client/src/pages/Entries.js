import '../entries.css';
import React from 'react';
import Data from '../entries.json';


function FetchData() {
  return (
    <div className="entries-container">
      <h1>Your Journal Entries</h1>

      <div className="entry-card">
        <h3>January 24, 2025</h3>
        <p>Had a great day walking in the park.</p>
      </div>

      

      <div className="button-container">
      <button className="entry-button">
      <img src="client/src/images/paper.png" alt="icon" />Button 1</button>
      <button className="entry-button">Button 2</button>
      <button className="entry-button">Button 3</button>
      <button className="entry-button">Button 4</button>
      <button className="entry-button">Button 5</button>
      <button className="entry-button">Button 6</button>
      <button className="entry-button">Button 7</button>
      <button className="entry-button">Button 7</button>
      <button className="entry-button">Button 7</button>
</div>

      <div className="test">
        <div className="posts">
          {Data.map((post) => {
            return (
              <div key={post.id}>
                <h4>{post.title}</h4>
                <p>{post.content}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default FetchData;