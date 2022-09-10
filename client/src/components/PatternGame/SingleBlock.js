import './SingleBlock.css'


const SingleBlock = ({ block, handleChoice, blockState, gameOver, disabled }) => {

    const handleClick = () => {
        if (!block.clicked && !gameOver && !disabled){
            handleChoice(block)
        }
    }

    const generateClassName = () => {
        if (blockState === "correct") {
            return ("block__correct-match")
        } else if (blockState === "incorrect") {
            return ("block__incorrect-match")
        } else {
            return ("block__standard")
        }
    }

    return(
        <div>
            <div className={generateClassName()} onClick={handleClick}></div>
        </div>
    )
}

export default SingleBlock