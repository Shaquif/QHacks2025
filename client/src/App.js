import Navbar from "./Navbar"
import Calendar from "./pages/Calendar"
import Entries from "./pages/Entries"
import ChatInterface from "./pages/Chat"; 
import { Route, Routes } from "react-router-dom"
import React from 'react';
import EntryPage from "./pages/EntryPage.js";


function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/Entries" element={<Entries />} />
          <Route path="/entry/:id" element={<EntryPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App