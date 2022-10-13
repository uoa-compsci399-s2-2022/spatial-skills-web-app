import { useRef } from 'react';
import { useEffect, useState } from 'react';
import '../../styles/MatchingGame.css';
import SingleCard from './SingleCard';
import seedrandom from "seedrandom";

// sources of card images
let cardImages = [
  { src: "/cardImages/2_of_clubs.png", matched: false },
  { src: "/cardImages/2_of_diamonds.png", matched: false },
  { src: "/cardImages/2_of_hearts.png", matched: false },
  { src: "/cardImages/2_of_spades.png", matched: false },
  { src: "/cardImages/3_of_clubs.png", matched: false },
  { src: "/cardImages/3_of_diamonds.png", matched: false },
  { src: "/cardImages/3_of_hearts.png", matched: false },
  { src: "/cardImages/3_of_spades.png", matched: false }
];

const MatchingGame = ({ 
  pairs, 
  gameStartDelay, 
  selectionDelay, 
  maxHealth, 
  timerState,
  timeAllowed, 
  randomSeed = null,
  description,
  next, 
  submit 
  }) => {

  const [cards, setCards] = useState([])
  // const [turns, setTurns] = useState(0) // add later if turns need to be recorded
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setdisAbled] = useState(false)
  const [bothMatched, setBothMatched] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [firstVisit, setFirstvisit] = useState(true)
  const [time, setTime] = useState(timeAllowed)
  const [timerOn, setTimerOn] = useState(false)
  const health = useRef(maxHealth)
  const matchedPair = useRef(0)

  cardImages = cardImages.slice(0, pairs)

  let randomNum = seedrandom(randomSeed)

  const shuffleCards = () => {

    // make double amount of cards
    const shuffledCards = [...cardImages, ...cardImages]
      // sort the cards array in random order
      .sort(() => randomNum() - 0.5)
      // add a new property 'id' for each card in array
      .map((card) => ({ ...card, id: randomNum() }));

    // store shuffled cards in state and reset turns to 0 (new game)
    setCards(shuffledCards)
    // setTurns(0)
    setTime(timeAllowed)
    setChoiceOne(null)
    setChoiceTwo(null)
    setBothMatched(true)
    setGameOver(false)
    showAllCards(true)
    setTimeout(() => {
      showAllCards(false)
      setTimerOn(true)
    }, gameStartDelay * 1000)
    setStarted(true)
    setFirstvisit(false)
  }

  // choosing a card
  const handleChoice = (card) => {
    // prevent user from double clicking on the same card
    if (card.id === choiceOne?.id){
      return
    }
    //check if 'choiceOne' is null, if false, store choice in choiceTwo
    //if true store choice in ChoiceOne
    
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  };

  // check if all cards matched
  const allMatched = () => {  
    if (matchedPair.current === cardImages.length){
      setGameOver(true)
    }
  }

  const showAllCards = (show) => {
    if(show) {
      setCards(prevCards => {
        return(prevCards.map(card => {
          return {...card, matched: true}
        }))
      })} else{
        setCards(prevCards => {
          return(prevCards.map(card => {
            return {...card, matched: false}
          }))
        })
      }
  }

  // timer
  useEffect(() => {
    let interval = null;

    if (timerState) {
      if (timerOn) {
        interval = setInterval(() => {
          setTime((prevTime) => prevTime - 1);
        }, 1000);
      } else {
        clearInterval(interval);
      }
    }
    return () => clearInterval(interval);
  }, [timerOn]);

  useEffect(() => {
    if (time === 0){
      setTimerOn(false)
      setGameOver(true)
    }
  }, [time])

  // compare 2 selected cards
  // runs when components first inserted in the dependency array and when it changes
  useEffect(() => {
    if (choiceOne && choiceTwo){ 
      setdisAbled(true)
      
      if (choiceOne.src === choiceTwo.src){
        setCards(prevCards => {
          return(prevCards.map(card => {
            if (card.src === choiceOne.src){
              return {...card, matched: true}
            } else{
              return (card)
            }
          }))
        })
        matchedPair.current += 1
        allMatched()
        setBothMatched(true)
        resetTurn()
      } else {
        // wait 1000ms before resetting cards
        health.current -= 1
        setBothMatched(false)
        setTimeout(() => resetTurn(), selectionDelay * 1000 + 250)
      }
    }
  }, [choiceOne, choiceTwo])

  // detect whether lives need to be reduced
  useEffect(() => {
    if (!bothMatched && health.current === 0){
      setGameOver(true)
    }
  }, [bothMatched])

  // if game over, flip all cards (as if they are all matched)
  useEffect(() => {
    if(gameOver){
      showAllCards(true)
      setTimerOn(false)
      // submit(matchedPair)
    }
  }, [gameOver])

  // reset choices
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setBothMatched(true)
    setdisAbled(false)

    // setTurns(prevTurns => prevTurns + 1)
  }

  const displayTimer = () => {
    if (timerState) {
      return (
        <div>
          <h2 className="pattern-game__timer">{time}</h2>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  return (
    <div className="matching-game">
      {firstVisit ? 
        <div className="matching-game__instructions">
          <h1>Memory Test: Card Matching</h1>
          <p>{description}</p>
          <button className='matching-game_start-button' onClick={shuffleCards}>Start</button>
        </div> : null}
      <div className={started ? 'matching-game__information-div-show':'matching-game__information-div-hide'}>
      
        <div className='matching-game__lives-div'>
            <h2 className='matching-game__lives-text'>Lives:</h2>
            <div className='matching-game__lives-div__hearts'>
              {[...Array(health.current)].map((e, i) => <span className="matching-game__heart" key={i}></span>)}
              {[...Array(maxHealth - health.current)].map((e, i) => <span className="matching-game__black-heart" key={i}></span>)}
            </div>         
        </div>
          {displayTimer()}
          <h2 className='matching-game__score'>Score: {matchedPair.current}</h2>
      </div>

      {gameOver ? 
        <div className='game-over-div'>
          <h2 className="game-over-text">Your score: {matchedPair.current}</h2>
          <button onClick={next}>Next Question</button>
        </div> : null}

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard 
          key={card.id} 
          card={card}
          handleChoice={handleChoice}
          // decide if a card should be flipped
          flipped={card === choiceOne || card === choiceTwo || card.matched}
          // pause before user can click on next card
          disabled={disabled}
          ></SingleCard>
        ))}
      </div>
    </div>
  );
}

export default MatchingGame
