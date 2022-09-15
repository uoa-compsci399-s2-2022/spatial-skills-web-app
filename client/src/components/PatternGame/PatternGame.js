import { useEffect, useState } from 'react'
import "../../styles/PatternGame.css";
import SingleBlock from './SingleBlock';


const endLevel = Array(20).fill(10)
const easyLevel = [3, 4, 5, 6, 7, 8, 8, 9, 9, 9]
const levelList = easyLevel.concat(endLevel)
const maxHealth = 5
// const timeAllowed = 120
const gameDim = 6

// create blocks array
const CreateBlockArray = (dimension) => {
  const bArray = []
  for (let i = 0; i < dimension * dimension; i++) {
    bArray.push({"id": i, "pattern": false, "matched": false, "clicked": false})
  }
  return bArray
}
const blocksArray = CreateBlockArray(gameDim)
let numMatched = 0
let health = maxHealth


function PatternGame(props) {
  const [blocks, setBlocks] = useState(blocksArray)
  const [patternBlocks, setPatternBlocks] = useState([])
  const [userCurrentChoice, setUserCurrentChoice] = useState(null)
  const [victory, setVictory] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [level, setLevel] = useState(0)
  const [time, setTime] = useState(props.timeAllowed)
  const [timerOn, setTimerOn] = useState(false)
  const [started, setStarted] = useState(false)

  const totalNumberOfBlocks = gameDim * gameDim
  const numberOfPatternBlocks = levelList[level]

  // get an random array of IDs
  // create pattern array marked by its key
  const generatePattern = () => {
    const generatePatternIDs = (length, numPatternBlocks) => {
      let randomIDsarray = Array.from(Array(numPatternBlocks).keys())
      .sort(() => Math.random() - 0.5)
      return(randomIDsarray.slice(0, length))
    }
    
    const patternIDs = generatePatternIDs(numberOfPatternBlocks, totalNumberOfBlocks)

    // reset blocks status
    blocks.map(block => {
      block.pattern = false
      block.matched = false
      block.clicked = false
      return(null)
    })
    
    // update block property if it's chosen to be the question pattern
    for(let i = 0; i < totalNumberOfBlocks; i++){
      for (let x = 0; x < numberOfPatternBlocks; x++){
        if (blocks[i].id === patternIDs[x]){
          blocks[i].pattern = true
        }
      }
    }

    numMatched = 0
    showPattern(true)
    setTimeout(() => {
      showPattern(false)
    }, 1000);
    setPatternBlocks(patternIDs)
    setDisabled(false)
    setVictory(false)
  }

  // handle user's choice
  const handleChoice = (block) => {
    setUserCurrentChoice(block)
  }

  // decide the color of a block
  const currentBlockState = (block) => {
    if (!started) {
      return ("")
    }
    if (block.pattern && block.matched) {
      return ("correct")
    } else if (block.clicked === true && block.matched === false) {
      return ("incorrect")
    } else {
      return ("grey")
    }
  }

  // show pattern
  const showPattern = (show) => {
    if (show){
      setBlocks(prevBlocks => {
        return (prevBlocks.map(block => {
            return ({...block, matched: true, clicked: true})
          })
        )})
    } else {
      setBlocks(prevBlocks => {
        return (prevBlocks.map(block => {
            return ({...block, matched: false, clicked: false})
          })
        )})
    }
  }

  const resetTurn = () => {
    setUserCurrentChoice(null)
  }

  // compare user's choice with pattern
  useEffect(() => {
    if (userCurrentChoice){
      if (patternBlocks.includes(userCurrentChoice.id)) {
        setBlocks(prevBlocks => {
          return (prevBlocks.map(block => {
            if (userCurrentChoice.id === block.id) {
              numMatched = numMatched + 1
              return ({...block, matched: true, clicked: true})
            } else {
              return (block)
            }
          })
          )})
        resetTurn()
      } else {
        setBlocks(prevBlocks => {
          return (prevBlocks.map(block => {
            if (userCurrentChoice.id === block.id) {
              health = health - 1
              if (health === 0) {
                setTimerOn(false)
                setGameOver(true)
                props.submit(level)
              }
              return ({...block, clicked: true})
            } else {
              return (block)
            }
          })
          )})
    
        resetTurn()
      }
    }
  
    if (numMatched === numberOfPatternBlocks) {
      setDisabled(true)
      setVictory(true)
      setLevel(prevLevel => prevLevel + 1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrentChoice])

  useEffect(() => {
    if (victory){
      setTimeout(() => {
        generatePattern()
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [victory])

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

  // time up
  useEffect(() => {
    if (time === 0){
      setTimerOn(false)
      setGameOver(true)
    }
  }, [time])

  const startGame = () => {
    setStarted(true)
    setTimeout(() => {
      setTimerOn(true)
      generatePattern()
    }, 300);
  }

  return (
    <div className={"pattern-game"}>
      {!started ? 
        <div className="pattern-game__instructions">
          <h1>Memory Test: Block Patterns</h1>
          <p>Click on the pattern shown at the start of the game</p>
          <p>You will lose a life for each mismatch.</p>
          <p>Progress as far as you can!</p>
          <p>Click start to begin.</p>
          <button className='pattern-game__start-button' onClick={startGame}>Start</button>
        </div> : null}
      <div className={started ? 'pattern-game__information-div-show' : 'pattern-game__information-div-hide'}>
      <div className='pattern-game__lives-div'>
          <h2 className='pattern-game__lives-number'>Lives:</h2>
          <div className='pattern-game__lives-div__hearts'>
          {[...Array(health)].map((e, i) => <span className="pattern-game__heart" key={i}></span>)}
          {[...Array(maxHealth - health)].map((e, i) => <span className="pattern-game__black-heart" key={i}></span>)}
          </div>         
      </div>
        <h2 className="pattern-game__timerText">{time}</h2>
        <h2>Score: {level}</h2>
      </div>
      {gameOver ? 
        <div className='game-over-div'>
          <h2 className="game-over-text">Your score: {level}</h2>
          <button onClick={props.next}>Next Question</button>
        </div> : null
      }
      <div className='pattern-game__blocks-grid'>
        {blocks.map(block => (
          <SingleBlock 
            key={block.id} 
            block={block} 
            handleChoice={handleChoice}
            blockState={currentBlockState(block)}
            gameOver={gameOver}
            disabled={disabled}
            />
        ))}
      </div>
    </div>
  );
}

export default PatternGame;

