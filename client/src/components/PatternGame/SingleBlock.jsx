import { useState } from 'react'
import '../../styles/SingleBlock.css'


const SingleBlock = ({ block, handleChoice, blockState, gameOver, disabled, clicked, flash, corsiMode }) => {
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

    const corsiGameMode = () => {
        if (corsiMode){
            return("block-" + block.id)
        } else {
            return ("")
        }
        
    }
    

    return(
        <div>
            <div className={corsiGameMode()}>
                <div className={generateClassName()} onClick={handleClick}></div>
            </div>
        </div>
    )
}

export default SingleBlock