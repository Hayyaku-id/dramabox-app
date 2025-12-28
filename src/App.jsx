import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import SearchPage from './pages/Search';
import Vip from './pages/Vip';
import Dubbed from './pages/Dubbed';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Footer from './components/Footer';
import './App.css'; // Standard App css if any, but we rely on index.css mainly

function App() {
  return (
    <Router>
      <div className="app" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/vip" element={<Vip />} />
            <Route path="/dubbed" element={<Dubbed />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<CategoryDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
