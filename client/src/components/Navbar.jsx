import '../styles/Navbar.css';
import logo from '../assets/logo.png';
import settings from '../assets/settings.png';
import help from '../assets/help.png';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import SettingsPopup from './NavbarSettingsPopup';
import HelpPopup from './NavbarHelpPopup';

const Navbar = () => {
    const[settingsPopup, setSettingsPopup] = useState(false);
    const[helpPopup, setHelpPopup] = useState(false);
    
    return(
        <div className="navbar">

        <Link to="/" ><img src={logo} className="logo" alt="Logo" /></Link>
        <button onClick={() => setSettingsPopup(true)} className="button">
            <img src={settings} className="button__icon" alt="Settings Button" />
        </button>
        <button onClick={() => setHelpPopup(true)} className="button">
            <img src={help} className="button__icon" alt="Help Button" />
        </button>
        
        <SettingsPopup trigger={settingsPopup} setTrigger={setSettingsPopup}>
        <h1 style={{color: "#28CFA7", fontSize: 32}}>Settings</h1>
                    <p style={{color: "#54757C", fontSize: 16}}>
                    Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit. 
                    Aliquam ac purus laoreet, 
                    consequat ante eu, 
                    aliquam neque.</p>
                    <h1 style={{color: "#28CFA7", fontSize: 24}}>Dark Mode</h1>
                    <p style={{color: "#54757C", fontSize: 16}}>
                    Lorem ipsum dolor sit amet, 
                    consectetur adipiscing elit.</p>
                    <h1 style={{color: "#28CFA7", fontSize: 24}}>Slider Timer</h1>
                    <p style={{color: "#54757C", fontSize: 16}}>
                    Show the remaining question time using a moving bar.</p>
        </SettingsPopup>

        <HelpPopup trigger={helpPopup} setTrigger={setHelpPopup}>
        <h1 style={{color: "#28CFA7", fontSize: 32}}>Looking for some help?</h1>
                    <p style={{color: "#54757C", fontSize: 16}}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Aliquam ac purus laoreet, consequat ante eu, aliquam neque. 
                    Fusce finibus tristique dui ac pretium. </p>
                    <h1 style={{color: "#28CFA7", fontSize: 24}}>Sub-title describing cool stuff!</h1>
                    <p style={{color: "#54757C", fontSize: 16}}>
                    Nulla commodo dui at convallis placerat. 
                    Etiam congue odio quis ultricies dignissim. 
                    Proin fringilla dignissim nibh, tempus efficitur dolor maximus eget.
                    <br></br>
                    <br></br>
                    Quisque diam quam, tristique gravida lectus id, hendrerit eleifend felis.</p>
        </HelpPopup>
        </div>
    );
}

export default Navbar;