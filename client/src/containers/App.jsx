import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './Home';
import Test from './Test';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GOOGLE_CLIENT_ID = '126878629767-elluidkp4g3iost84sgh5spapdq30su7.apps.googleusercontent.com';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Test />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
