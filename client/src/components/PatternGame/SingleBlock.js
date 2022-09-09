import './SingleBlock.css'


const SingleBlock = ({ block, handleChoice, blockState }) => {

    const handleClick = () => {
        if (!block.clicked){
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
            <div className={generateClassName()} onClick={handleClick}>{block.id}</div>
        </div>
    )
}

export default SingleBlock