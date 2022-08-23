import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import Home from './Home';
import Test from './Test';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/test" element={<Test />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
