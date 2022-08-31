import React from 'react'
import '../styles/Navbar.css'

function SettingsPopup(props) {
    return(props.trigger) ? (
        <div className="popup">
                <div className="popup-inner">
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    <b>X</b></button>
                    {props.children}
                </div> 
        </div>

    ) : "";
}

export default SettingsPopup