import '../styles/Home.css';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

import { GoogleLogin} from '@react-oauth/google';
import { useState } from 'react';

const Home = () => {
    const navigate = useNavigate();
    const nameRef = useRef(null);
    const [displayError, setDisplayError] = useState(false);
    const [userName, setUserName] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();    // this stops the page from reloading by default
        setDisplayError(false);
        const name = nameRef.current.value;
        if (name.length === 0) {
            setDisplayError(true);
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
                    onSuccess={() => console.log("Success!")}
                    onError={() => console.log("Failed!")}
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
                        displayError ?
                        <p className='home__error'>Invalid Name!</p> :
                        null
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