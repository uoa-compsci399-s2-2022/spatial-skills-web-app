import "../../styles/MatchingGameStyles/GameOver.css";

const GameOverString = ({ defeat, victory }) => {
  if (victory) {
    return <h2 className="gameOver-text">Good job, You won!</h2>;
  }
  if (defeat) {
    return <h2 className="gameOver-text">Game Over</h2>;
  }
};

function GameOver({ defeat, victory }) {
  if (defeat || victory) {
    return (
      <div className="gameOver-text-block">
        <GameOverString defeat={defeat} victory={victory}></GameOverString>
      </div>
    );
  }
}
export default GameOver;
