import '../../styles/SingleCard.css'


const SingleCard = ({ card, handleChoice, flipped, disabled}) => {
  return (
    <div>
      <div className="card">
        <div className={flipped ? "flipped" : "not-flipped"}> 
          <img className="card-front" src={card.src} alt="front of card"></img>
          <img
            className="card-back"
            src="/cardImages/cover.png"
            onClick={() => !disabled ? handleChoice(card) : null}
            alt="back of card"
          ></img>
        </div>
      </div>
    </div>
  );
}

export default SingleCard;
