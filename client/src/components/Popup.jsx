import React from 'react'
import '../styles/Navbar.css'

function Popup(props) {
    const { trigger, children, setTrigger } = props;

    return(trigger) ? (
        <div className="popup">
            <div className="popup-inner">
                <button className="close-btn" onClick={() => setTrigger(false)}>
                <b>X</b></button>
                {children}
            </div> 
        </div>
    ) : "";
}

export default Popup