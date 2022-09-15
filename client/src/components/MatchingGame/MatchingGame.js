import { useEffect, useState } from 'react';
import '../../styles/MatchingGame.css';
import SingleCard from './SingleCard';

// sources of card images
const cardImages = [
  { src: "/cardImages/2_of_clubs.png", matched: false },
  { src: "/cardImages/2_of_diamonds.png", matched: false },
  { src: "/cardImages/2_of_hearts.png", matched: false },
  { src: "/cardImages/2_of_spades.png", matched: false },
  { src: "/cardImages/3_of_clubs.png", matched: false },
  { src: "/cardImages/3_of_diamonds.png", matched: false },
  { src: "/cardImages/3_of_hearts.png", matched: false },
  { src: "/cardImages/3_of_spades.png", matched: false }
];

const maxHealth = 3
const timeBetweenSelection = 1000
const timeBeforeGameStart = 4000
const timeAllowed = 40

let health = maxHealth
let matchedPair = 0

const MatchingGame = (props) => {
  const [cards, setCards] = useState([])
  // const [turns, setTurns] = useState(0) // add later if turns need to be recorded
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setdisAbled] = useState(false)
  const [bothMatched, setBothMatched] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [started, setStarted] = useState(false)
  const [firstVisit, setFirstvisit] = useState(true)
  const [time, setTime] = useState(props.timeAllowed)
  const [timerOn, setTimerOn] = useState(false)


  const shuffleCards = () => {

    // make double amount of cards
    const shuffledCards = [...cardImages, ...cardImages]
      // sort the cards array in random order
      .sort(() => Math.random() - 0.5)
      // add a new property 'id' for each card in array
      .map((card) => ({ ...card, id: Math.random() }));

    // store shuffled cards in state and reset turns to 0 (new game)
    setCards(shuffledCards)
    // setTurns(0)
    setTime(props.timeAllowed)
    setChoiceOne(null)
    setChoiceTwo(null)
    setBothMatched(true)
    setGameOver(false)
    showAllCards(true)
    setTimeout(() => {
      showAllCards(false)
      setTimerOn(true)
    }, timeBeforeGameStart)
    setStarted(true)
    setFirstvisit(false)
    health = maxHealth
    matchedPair = 0
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
    if (matchedPair === cardImages.length){
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
    let interval = null

    if (timerOn) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime - 1)
      }, 1000)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [timerOn])

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
        matchedPair = matchedPair + 1
        allMatched()
        setBothMatched(true)
        resetTurn()
      } else {
        // wait 1000ms before resetting cards
        health -= 1
        setBothMatched(false)
        setTimeout(() => resetTurn(), timeBetweenSelection + 500)
      }
    }
  }, [choiceOne, choiceTwo])

  // detect whether lives need to be reduced
  useEffect(() => {
    if (!bothMatched && health === 0){
      setGameOver(true)
    }
  }, [bothMatched])

  // if game over, flip all cards (as if they are all matched)
  useEffect(() => {
    if(gameOver){
      showAllCards(true)
      setTimerOn(false)
      props.submit(matchedPair)
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

  return (
    <div className="matching-game">
      {firstVisit ? 
        <div className="matching-game__instructions">
          <h1>Memory Test: Card Matching</h1>
          <p>Match those cards in pairs before time runs out!</p>
          <p>You will lose a life for each mismatch.</p>
          <p>Click start to begin.</p>
          <button className='matching-game_start-button' onClick={shuffleCards}>Start</button>
        </div> : null}
      <div className={started ? 'matching-game__information-div-show':'matching-game__information-div-hide'}>
      
      <div className='matching-game__lives-div'>
          <h2 className='matching-game__lives-text'>Lives:</h2>
          <div className='matching-game__lives-div__hearts'>
          {[...Array(health)].map((e, i) => <span className="matching-game__heart" key={i}></span>)}
          {[...Array(maxHealth - health)].map((e, i) => <span className="matching-game__black-heart" key={i}></span>)}
          </div>         
      </div>
        {started ? <h2 className="timer-text">{time}</h2> : null}
        <h2>Score: {matchedPair}</h2>
      </div>

      {gameOver ? 
        <div className='game-over-div'>
          <h2 className="game-over-text">Your score: {matchedPair}</h2>
          <button onClick={props.next}>Next Question</button>
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
