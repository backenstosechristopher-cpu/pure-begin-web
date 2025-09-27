import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen bg-background text-foreground">
              <header className="border-b">
                <div className="container mx-auto px-4 py-6">
                  <h1 className="text-2xl font-bold">Mirrored Site</h1>
                </div>
              </header>
              <main className="container mx-auto px-4 py-8">
                <div className="text-center">
                  <h2 className="text-xl mb-4">Welcome to your React application</h2>
                  <p className="text-muted-foreground">
                    This is a React app running in Lovable. The previous static HTML files have been replaced with a proper React structure.
                  </p>
                </div>
              </main>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;