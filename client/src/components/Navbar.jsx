import '../styles/Navbar.css';
import logo from '../assets/logo.png';
import settings from '../assets/settings.png';
import help from '../assets/help.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Popup from './Popup';

const Navbar = () => {
    const[settingsPopup, setSettingsPopup] = useState(false);
    const[helpPopup, setHelpPopup] = useState(false);
    
    return(
        <nav className="navbar">

        <Link to="/" ><img src={logo} className="navbar__logo" alt="Logo" /></Link>
        <button onClick={() => setSettingsPopup(true)} className="navbar__button">
            <img src={settings} className="navbar__button__icon" alt="Settings Button" />
        </button>
        <button onClick={() => setHelpPopup(true)} className="navbar__button">
            <img src={help} className="navbar__button__icon" alt="Help Button" />
        </button>
        
        <Popup trigger={settingsPopup} setTrigger={setSettingsPopup}>
            <h1 className="popup-header">Settings</h1>
            <p className="popup-content">
                Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit. 
                Aliquam ac purus laoreet, 
                consequat ante eu, 
                aliquam neque.</p>
            <h2 className="popup-sub-title">Dark Mode</h2>
            <p className="popup-content">
                Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit.</p>
            <h2 className="popup-sub-title">Slider Timer</h2>
            <p className="popup-content">
                Show the remaining question time using a moving bar.</p>
        </Popup>

        <Popup trigger={helpPopup} setTrigger={setHelpPopup}>
            <h1 className="popup-header">Looking for some help?</h1>
            <p className="popup-content">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                Aliquam ac purus laoreet, consequat ante eu, aliquam neque. 
                Fusce finibus tristique dui ac pretium. </p>
            <h2 className="popup-sub-title">Sub-title describing cool stuff!</h2>
            <p className="popup-content">
                Nulla commodo dui at convallis placerat. 
                Etiam congue odio quis ultricies dignissim. 
                Proin fringilla dignissim nibh, tempus efficitur dolor maximus eget.
            <br></br>
            <br></br>
                Quisque diam quam, tristique gravida lectus id, hendrerit eleifend felis.</p>
        </Popup>
        </nav>
    );
}

export default Navbar;