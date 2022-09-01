import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

import { GoogleLogin} from '@react-oauth/google';

const Home = () => {
    const navigate = useNavigate();
    return(
        <div className='home'>
            <img src={logo} className='home__logo' alt="" />
            <div className='home__content'>
                <GoogleLogin 
                    onSuccess={() => console.log("Success!")}
                    onError={() => console.log("Failed!")}
                    width='240'
                />
                <form onSubmit={(e) => {e.preventDefault(); navigate('/test')}} className='home__form'>
                    <input type="text" placeholder="Name" className='home__input home__input--text' />
                    <button className='home__input home__input--button'>Enter</button>
                </form>
            </div>
        </div>
    );
}

export default Home;