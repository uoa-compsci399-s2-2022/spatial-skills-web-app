import '../../styles/MatchingGameStyles/LivesCounter.css'

// not printing "lives" if game over
const ShowLivesText = ({ numHearts }) => {
    return (<h2 className='livesNum'>lives:</h2>)
}

function LivesCounter ({ numLives, onLaunch }) {
    if (!onLaunch){
        return(
            <div className='lives-div'>
                <ShowLivesText numHearts={numLives}></ShowLivesText>
                {[...Array(numLives)].map((e, i) => <span className="heart" key={i}></span>)}
            </div>
        )
    }
}

export default LivesCounter