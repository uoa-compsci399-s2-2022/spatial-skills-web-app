import './LivesCounter.css'

// not printing "lives" if game over
const ShowLivesText = ({ numHearts }) => {
    if(numHearts > 0) {
        return (<h2 className='livesNum'>lives:</h2>)
    }
}

function LivesCounter ({ numLives }) {
    return(
        <div>
            <ShowLivesText numHearts={numLives}></ShowLivesText>
            {[...Array(numLives)].map((e, i) => <span className="heart" key={i}></span>)}
        </div>
    )
}

export default LivesCounter