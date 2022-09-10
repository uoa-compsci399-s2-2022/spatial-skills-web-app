import { useEffect, useState } from 'react'
import "./PatternGame.css";
import SingleBlock from './SingleBlock';


const gameDim = 6
const levelList = [3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
const maxHealth = 5

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
let diffculty = 1


function PatternGame() {
  const [blocks, setBlocks] = useState(blocksArray)
  const [patternBlocks, setPatternBlocks] = useState([])
  const [userCurrentChoice, setUserCurrentChoice] = useState(null)
  const [vicotry, setVictory] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [level, setLevel] = useState(1)

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
    if (block.pattern && block.matched) {
      return ("correct")
    } else if (block.clicked === true && block.matched === false) {
      return ("incorrect")
    } else {
      return ("nothing")
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
                setGameOver(true)
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
      diffculty = diffculty + 1
      setLevel(prevLevel => prevLevel + 1)
    }
  }, [userCurrentChoice])

  useEffect(() => {
    if (vicotry){
      setTimeout(() => {
        generatePattern()
      }, 500);
    }
  }, [vicotry])

  // start game on launch
  useEffect(() => {
    generatePattern()
  }, [])

  // alert game over
  const GameOverText = () => {
    if (gameOver){
      return (
        <div className='game-over-div'>
          <h2 className="game-over-text">Your score: {diffculty}</h2>
        </div>
      )}
  }

  // lives counter
  const LivesCounter = () => {
    return(
      <div className='pattern-game__lives-div'>
          <h2 className='pattern-game__lives-number'>lives:</h2>
          <div className='lives-div__hearts'>
          {[...Array(health)].map((e, i) => <span className="heart" key={i}></span>)}
          {[...Array(maxHealth - health)].map((e, i) => <span className="black-heart" key={i}></span>)}
          </div>         
      </div>
    )
  }

  // timer
  const DisplayTime = () => {
    return (
      <div>
        <h2>Time left: 60</h2>
      </div>
    )
  }

  return (
    <div className="pattern-game">
      <div className='pattern-game__information-div'>
      <LivesCounter />
      <DisplayTime />
      <h2>Level: {level}</h2>

      </div>
      <GameOverText />
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

