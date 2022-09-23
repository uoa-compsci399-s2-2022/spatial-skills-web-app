import { useState } from 'react'
import '../../styles/SingleBlock.css'


const SingleBlock = ({ block, handleChoice, blockState, gameOver, disabled, clicked, flash }) => {
    const [reset, setReset] = useState(false)

    const handleClick = () => {
        if (!block.clicked && !gameOver && !disabled){
            handleChoice(block)
        }
    }

    const generateClassName = () => {
        if (blockState === "correct") {
            return ("block__correct-match")
        } else if (blockState === "incorrect") {
            if(flash){
                return ("block__flash-color")
            } else{
                return ("block__incorrect-match") 
            }
        } else if (blockState === "grey") {
            return ("block__standard")
        }
    }

    return(
        <div>
            <div className={generateClassName()} onClick={handleClick}><p className='pa'>{block.id}</p></div>
        </div>
    )
}

export default SingleBlock