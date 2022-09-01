import '../styles/Home.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = '126878629767-elluidkp4g3iost84sgh5spapdq30su7.apps.googleusercontent.com';

const Home = () => {
    return(
        <div className='home'>
            <div className='home__content'>
                <img src={logo} className='home__logo' alt="" />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Aliquam ac purus laoreet, consequat ante eu, aliquam neque. 
                    Fusce finibus tristique dui ac pretium.<br /><br />Quisque 
                    diam quam, tristique gravida lectus id, hendrerit eleifend 
                    felis.
                </p>
                <Link to="test" className='home__button'>START TEST</Link>
                <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                    <GoogleLogin 
                        onSuccess={() => console.log("Success!")}
                        onFailure={() => console.log("Failed!")}
                    />
                </GoogleOAuthProvider>
            </div>
        </div>
    );
}

export default Home;