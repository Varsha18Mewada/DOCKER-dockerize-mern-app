import React from 'react';
import { Navbar } from './components/navbar/Navbar';
import { Routing } from './routes/Routing';
import './App.css';

function App() {
  return (
    <>
      <Navbar />
      <Routing />
    </>
  );
}

export default App;
