import '../styles/Home.css';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin} from '@react-oauth/google';
import logo from '../assets/logo.png';

const Home = () => {
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const [error, setError] = useState("");
    const [userName, setUserName] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();    // this stops the page from reloading by default
        setError("");
        const name = nameRef.current.value;
        if (name.length === 0) {
            setError("Invalid name!");
        } else {
            setUserName(name);
            console.log(name)    // this is the input name
            navigate('/test');     // go to test page 
        }        
    }

    return(
        <div className='home'>
            <img src={logo} className='home__logo' alt="" />
            <div className='home__content'>
                <GoogleLogin 
                    onSuccess={(credentialResponse) => console.log(credentialResponse)}
                    onError={() => setError("Unable to authenticate Google account!")}
                    width='240'
                />
                <form onSubmit={(e) => handleSubmit(e)} className='home__form'>
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