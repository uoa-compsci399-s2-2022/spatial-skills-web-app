import React from 'react'
import '../styles/Navbar.css'

function Popup(props) {
    const { trigger } = props;

    return(trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => props.setTrigger(false)}>
                <b>X</b></button>
                {props.children}
            </div> 
        </div>
    ) : "";
}

export default Popup