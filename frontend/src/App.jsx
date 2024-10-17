import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import NavBar from './components/Navbar';
import Home from './components/Home';
import CreateNFT from './components/CreateNFT';
import NFTCarousel from './components/NFTCarousel';
import HowItWorks from './components/HowItWorks';
import AboutUs from './components/AboutUs';
import FaqRoadmap from './components/FaqRoadmap';
import TeamMembers from './components/TeamMembers';
import Community from './components/Community';
import Marketplace from './components/Marketplace';
import UserControl from './components/UserControl';
import FAQSection from './components/FAQSection';

function Layout() {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  return (
    <div>
      <NavBar />
      {isHomeRoute && (
        <>
          <Home />
          <NFTCarousel />
          <HowItWorks />
          <AboutUs />
          <FaqRoadmap />
          <TeamMembers />
          <FAQSection />
          <Community />
        </>
      )}
      <Outlet /> {/* Renders the nested routes, including Home on the root route */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="CreateNFT" element={<CreateNFT />} />
          <Route path="Marketplace" element={<Marketplace />} />
          <Route path="UserControl" element={<UserControl />} />
          {/* Add more routes as needed */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
