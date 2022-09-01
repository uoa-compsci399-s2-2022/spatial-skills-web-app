import { useEffect, useState } from "react";
import "./MatchingGame.css";
import SingleCard from "./SingleCard";
import LivesCounter from "./LivesCounter";
import GameOver from "./GameOver";

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

const maxHealth = 7
let health = maxHealth
let matchedPair = 0

function CardMatching() {
  const [cards, setCards] = useState([])
  // const [turns, setTurns] = useState(0) // add later if turns need to be recorded
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setdisAbled] = useState(false)
  const [bothMatched, setBothMatched] = useState(true)
  const [gameOver, setGameOver] = useState(false)
  const [lives, setLives] = useState(maxHealth)
  const [win, setWin] = useState(false)


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
    setChoiceOne(null)
    setChoiceTwo(null)
    setBothMatched(true)
    setGameOver(false)
    setLives(maxHealth)
    setWin(false)
    health = maxHealth
    matchedPair = 0
  }

  const allMatched = () => {  
    if (matchedPair === cardImages.length){
      setWin(true)
    }
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
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  // start game on launch
  useEffect(() => {
    shuffleCards()
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
    if(gameOver) {
      setCards(prevCards => {
        return(prevCards.map(card => {
          return {...card, matched: true}
        }))
      })
    }
  }, [gameOver])


  // reset choices and increase turn by 1
  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setdisAbled(false)
    setBothMatched(true)
    // setTurns(prevTurns => prevTurns + 1)

  }

  return (
    <div className="game-start">
      <h1>Card Matching Game</h1>
      <button onClick={shuffleCards}>Start</button>
      <div className="lives-div">
        <LivesCounter numLives={lives}></LivesCounter>
      </div>
      <div>
        <GameOver defeat={gameOver} victory={win}></GameOver>
      </div>
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

export default CardMatching;
