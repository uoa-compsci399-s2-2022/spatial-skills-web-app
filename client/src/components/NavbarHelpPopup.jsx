import React from 'react'
import '../styles/Navbar.css'

function HelpPopup(props) {
    return(props.trigger) ? (
        <div className="popup">
                <div className="popup-inner" style={{width: "480px", height: "456px"}}>
                    <button className="close-btn" onClick={() => props.setTrigger(false)}>
                    <b>X</b></button>
                    {props.children}
                </div> 
        </div>

    ) : "";
}

export default HelpPopup