import { useEffect, useState } from 'react';
import '../../styles/MatchingGameStyles/./MatchingGame.css';
import SingleCard from './SingleCard';
import LivesCounter from './LivesCounter';
import GameOver from './GameOver';

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
const timeAllowed = 15

let health = maxHealth
let matchedPair = 0

function MatchingGame() {
  const [cards, setCards] = useState([])
  // const [turns, setTurns] = useState(0) // add later if turns need to be recorded
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setdisAbled] = useState(false)
  const [bothMatched, setBothMatched] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [lives, setLives] = useState(maxHealth)
  const [win, setWin] = useState(false)
  const [showCards, setShowCards] = useState(true)
  const [started, setStarted] = useState(false)
  const [firstVisit, setFirstvisit] = useState(true)
  const [time, setTime] = useState(timeAllowed)
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
    setTimerOn(true)
    setTime(timeAllowed)
    setChoiceOne(null)
    setChoiceTwo(null)
    setBothMatched(true)
    setGameOver(false)
    setLives(maxHealth)
    setWin(false)
    setShowCards(prevState => !prevState)
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

  const allMatched = () => {  
    if (matchedPair === cardImages.length){
      setWin(true)
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
    console.log(time)
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
        setLives(prevLives => prevLives - 1)
        setBothMatched(false)
        setTimeout(() => resetTurn(), timeBetweenSelection)
      }
    }
  }, [choiceOne, choiceTwo])

  // start game on launch
  useEffect(() => {
    setFirstvisit(true)
    setStarted(false)
  }, [])

  // detect whether lives need to be reduced
  useEffect(() => {
    if (!bothMatched && health >= 1) {
      health -= 1
    }

    if (!bothMatched && health === 0){
      setGameOver(true)
    }
  }, [bothMatched])

  // if game over, flip all cards (as if they are all matched)
  useEffect(() => {
    if(gameOver){
      showAllCards(true)
      setTimerOn(false)
    }
  }, [gameOver])

  // show cards on game start temporarily
  useEffect(() => {
    showAllCards(true)
    setTimeout(() => showAllCards(false), timeBeforeGameStart)
  }, [showCards])


  // reset choices and increase turn by 1
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setdisAbled(false)
    setBothMatched(true)
    // setTurns(prevTurns => prevTurns + 1)
  }

  // display timer when game starts
  const DisplayTime = () => {
    if (started){
      return(
        <p className="timerText">{time}</p>
      )
    }
  }

  const Instructions = () => {
    if (firstVisit){
      return (
        <div className="instructions">
          <h1>Spatial Memory Test 1</h1>
          <p>Match those cards in pairs before time runs out!</p>
          <p>You will lose a life for each mismatch.</p>
          <p>Click start to begin.</p>
          <button onClick={shuffleCards}>Start</button>
        </div>
      )
    }
  }

  return (
    <div className="game-start">
      <Instructions></Instructions>
      <div>
        <button onClick={shuffleCards}>Restart</button>
      </div>
      <div className="lives-div">
        <LivesCounter numLives={lives} onLaunch={firstVisit}></LivesCounter>
      </div>
      <div>
        <DisplayTime></DisplayTime>
      </div>
      <GameOver defeat={gameOver} victory={win}></GameOver>
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
