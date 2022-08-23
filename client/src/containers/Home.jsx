import '../styles/Home.css';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

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
            </div>
        </div>
    );
}

export default Home;