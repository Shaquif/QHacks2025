import Navbar from "./Navbar";
import Calendar from "./pages/Calendar";
import Chat from "./pages/Chat";
import Entries from "./pages/Entries";
import EntryPage from "./pages/EntryPage";  // Import the new entry page
import { Route, Routes } from "react-router-dom";
import React from 'react';

function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/entries" element={<Entries />} />
          <Route path="/entry/:id" element={<EntryPage />} /> {/* New Route for Viewing Entries */}
        </Routes>
      </div>
    </>
  );
}

export default App;
