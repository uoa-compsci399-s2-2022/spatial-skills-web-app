import React from 'react'
import '../styles/Timer.css';
import {useState, useEffect, useRef} from 'react';
import pointer from '../assets/pointer.png';

function Timer({maxRange}) {
    const [counter,setCounter] = useState(0);
    const [maxCounter] = useState(maxRange);
    const ref = useRef(null);
    var result = 0;

    useEffect((percentage)=>{
        const resizeableElement = ref.current;
        if(counter<maxCounter){
            //Resize the slider bar's width.
            resizeableElement.style.width = `${counter*(100/maxCounter)}%`;
            /*
            The timer counts up to the specified value. The output will still count downwards,
            this is just a convienient way to calculate the necessary width of the slider.
            */
            setTimeout(()=>setCounter(counter+.01),10);
        }
    },[counter, maxCounter])

    //Ensure the output does not portray as negative.
    if (maxCounter-counter<0) {
        result = 0;
    } else {
        result = maxCounter-counter;
    }

    return(
        <div>
        <div className = "slider-background"></div>
        <div className = "slider" ref={ref}>
            <div className = "slider-pointer">
            <img src={pointer} ref={ref} alt = "pointer"/>
            <div className = "timer">
                {parseInt(result)}s
            </div>
            </div>
            </div>
        </div>
        
    );
}

export default Timer;