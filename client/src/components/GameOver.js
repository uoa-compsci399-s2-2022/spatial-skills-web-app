import './GameOver.css'

function GameOverString({ defeat, victory}) {
    if (victory) {
        return (<h2 className='gameOver-text'>Good job, You won!</h2>)
    } 
    if (defeat) {
        return (<h2 className='gameOver-text'>Better luck next time~~</h2>)
    }

}

function GameOver({ defeat, victory}) { 

    return (
        <div className='gameOver-text-block'>
            <GameOverString defeat={defeat} victory={victory}></GameOverString>
        </div>
        )}
export default GameOver