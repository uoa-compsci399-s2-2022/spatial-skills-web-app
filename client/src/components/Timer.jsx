import React from 'react'
import '../styles/Timer.css';
// import {useState, useEffect, useRef} from 'react';
import pointer from '../assets/pointer.png';

function Timer({questionTime, timeLeft}) {

    return(
        <div title='Time Left'>
            <div className="slider-background"></div>
            <div className="slider" style={{
                width: `${(Math.abs(timeLeft - questionTime) / questionTime) * 100}%`,
                background: timeLeft > 10 ? null : "red"}}
            >
                <div className="slider-pointer">
                    {/* <img src={pointer} alt="pointer"/>
                    <div className = "timer">
                        {timeLeft}s
                    </div> */}
                </div>
            </div>
        </div>
        
    );
}

export default Timer;