import Navbar from "./Navbar"
import Calendar from "./pages/Calendar"
import Chat from "./pages/Chat"
import Entries from "./pages/Entries"
import ChatInterface from "./pages/Chat"; 
import { Route, Routes } from "react-router-dom"
import React from 'react';


function App() {
  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/Entries" element={<Entries />} />
        </Routes>
      </div>
    </>
  )
}

export default App