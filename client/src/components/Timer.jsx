import React from 'react'
import '../styles/Timer.css';
import {useState, useEffect, useRef} from 'react';
import pointer from '../assets/pointer.png';


function Timer({maxRange}) {
    const [counter,setCounter] = useState(maxRange);
    const [maxCounter] = useState(maxRange);
    const ref = useRef(null);

    

    useEffect(()=>{
        
        const resizeableElement = ref.current;
        const styles = window.getComputedStyle(resizeableElement);
        let width = parseInt(styles.width);
        
        resizeableElement.style.width = "100";


        if(counter>0){
            setTimeout(()=>setCounter(counter-.01),10);
        }
        if(counter > -1){
            width = width - 16.55 / maxCounter;
            resizeableElement.style.width = `${width}px`;
        }
    },[counter, maxCounter])

    return(
        <div>
        <div className = "slider-background"></div>
        <div className = "slider" ref={ref}>
            <div className = "slider-pointer">
            <img src={pointer} ref={ref} alt = "pointer"/>
            <div className = "timer">
                {parseInt(counter)}s
            </div>
            </div>
            </div>
        </div>
        
    );
}

export default Timer;