import '../styles/Home.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin} from '@react-oauth/google';
import jwt_decode from "jwt-decode";
import logo from '../assets/logo.png';
import Profile from '../components/Profile';

const Home = () => {
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const [error, setError] = useState("");
    const [userData, setUserData] = useState({
        name: null,
        email: null,
        picture: null
    });

    const handleSubmit = () => {
        setError("");
        const name = nameRef.current.value;
        if (name.length === 0) {
            setError("Invalid name!");
        } else {
            setUserData({
                name: name,
                email: null,
                picture: null
            })
            navigate('/test');     // go to test page 
        }        
    }

    const handleGoogleLogin = (credentials) => {
        setError("");
        const payload = jwt_decode(credentials);
        setUserData({
            name: payload.given_name + " " + payload.family_name,
            email: payload.email,
            picture: payload.picture
        })
        navigate('/test');
    }

    return(
        <div className='home'>
            {/* the Profile component should be moved into the navbar */}
            <Profile 
                name={userData.name} 
                email={userData.email} 
                picture={userData.picture} 
                setUserData={setUserData}
            />
            <img src={logo} className='home__logo' alt="" />
            <div className='home__content'>
                <GoogleLogin 
                    onSuccess={(credentialResponse) => handleGoogleLogin(credentialResponse.credential)}
                    onError={() => setError("Unable to authenticate Google account!")}
                    width='240'
                />
                <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }} className='home__form'>
                    <input 
                        type="text" 
                        placeholder="Name" 
                        className='home__input home__input--text' 
                        ref={nameRef} 
                    />
                    {
                        error === "" ?
                        null :
                        <p className='home__error'>{error}</p> 
                    }
                    <button 
                        className='home__input home__input--button'
                    >
                        Enter
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Home;