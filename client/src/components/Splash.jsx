import background from '../assets/background.png';
import '../styles/Splash.css';

const Splash = () => {
    return(
        <div className="splash">
            <img src={background} alt="" className="splash__image" />
        </div>
    );
}

export default Splash;