import Navbar from "./Navbar"
import Calendar from "./pages/Calendar"
import Chat from "./pages/Chat"
import Entries from "./pages/Entries"
import ChatInterface from "./pages/ChatTest"; 
import { Route, Routes } from "react-router-dom"
import React from 'react';
import EntryPage from "./pages/EntryPage.js";


function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/chat" element={<Chat />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/Entries" element={<Entries />} />
          <Route path="/chatTest" element={<ChatInterface />} />
          <Route path="/entry/:id" element={<EntryPage />} /> 
        </Routes>
      </div>
    </>
  )
}

export default App