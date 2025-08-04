import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Devis from './pages/Devis';
import Resume from './pages/Resume';

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1  overflow-y-auto h-screen">
        <Routes>
          <Route path="/" element={<Devis />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;