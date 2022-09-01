import "./SingleCard.css";

function SingleCard({ card, handleChoice, flipped, disabled }) {

    const handleClick = () => {
        if (!disabled){
          handleChoice(card)
        }
    }

  return (
    <div>
      <div className="card">
        <div className={flipped ? "flipped" : ""}> 
          <img className="card-front" src={card.src} alt="front of card"></img>
          <img
            className="card-back"
            src="/cardImages/cover.png"
            onClick={handleClick}
            alt="back of card"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default SingleCard;
