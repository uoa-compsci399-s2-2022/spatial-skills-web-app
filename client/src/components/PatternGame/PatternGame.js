import { useEffect, useRef, useState } from 'react'
import "../../styles/PatternGame.css";
import SingleBlock from './SingleBlock';




let numMatched = 0
let currentPatternIndex = 0

function PatternGame({ gameDim, order, maxHealth, timeAllowed, 
                       patternFlashTime, next, submit}) {
  patternFlashTime = patternFlashTime * 1000

  // create blocks array
  const CreateBlockArray = (dimension) => {
    const bArray = []
    for (let i = 0; i < dimension * dimension; i++) {
      bArray.push({"id": i, "pattern": false, "matched": false, "clicked": false, "flash": false})
    }
    return bArray
  }
  const blocksArray = CreateBlockArray(gameDim)


  const [blocks, setBlocks] = useState(blocksArray)
  const [patternBlockID, setPatternBlockIDs] = useState([])
  const [userCurrentChoice, setUserCurrentChoice] = useState(null)
  const [victory, setVictory] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [level, setLevel] = useState(0)
  const [time, setTime] = useState(timeAllowed)
  const [timerOn, setTimerOn] = useState(false)
  const [started, setStarted] = useState(false)
  const [displayOrder, setDisplayOrder ] = useState(true)
  const health = useRef(maxHealth)

  const totalNumberOfBlocks = gameDim * gameDim
  const levelList = Array.from({length: totalNumberOfBlocks}, (_, i) => i + 1)
  const numberOfPatternBlocks = levelList[level]


  let patternIDArray
  let startAlready = false

  // get an random array of IDs
  const generatePatternIDs = (length, numPatternBlocks) => {
    let randomIDsarray = Array.from(Array(numPatternBlocks).keys())
    .sort(() => Math.random() - 0.5)
    return(randomIDsarray.slice(0, length))
  }
  

  // create pattern array marked by its key
  const generatePattern = () => {

    // reset blocks status each round
    blocks.map(block => {
      block.pattern = false
      block.matched = false
      block.clicked = false
      block.flash = false
      return(null)
    })

    const patternIDs = generatePatternIDs(numberOfPatternBlocks, totalNumberOfBlocks)
    patternIDArray = patternIDs
    
    // update block property if it's chosen to be the question pattern
    for(let i = 0; i < totalNumberOfBlocks; i++){
      for (let x = 0; x < numberOfPatternBlocks; x++){
        if (blocks[i].id === patternIDs[x]){
          blocks[i].pattern = true
        }
      }
    }

    numMatched = 0
    if(!order){
      setDisabled(true)
      showPattern(true)

      setTimeout(() => {
        showPattern(false)
        setDisabled(false)
      }, patternFlashTime);
    } else {
      setDisplayOrder(prevState => !prevState)
    }
    setPatternBlockIDs(patternIDs)
    setVictory(false)
    startAlready = true
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
    } else if ((block.clicked === true && block.matched === false) || block.flash) {
      return ("incorrect")
    } else {
      return ("grey")
    }
  }


  const reveal = (block) => {
    let newBlock = {...block, matched: true, clicked: true}
    return (newBlock)
  }

  const unreveal = () => {
    setBlocks(prevBlocks => {
      return (prevBlocks.map(block => {
        if(block.matched === true && block.clicked === true){
          return ({...block, matched: false, clicked: false})
        } else{
          return (block)
        }
        })
      )})
  }

  // show pattern for standard version of game (not ordered)
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

  // display pattern in order
  useEffect(() => {
    if (order){
      if(currentPatternIndex < patternBlockID.length) {
          setDisabled(true)

          if(currentPatternIndex === 0){
            setBlocks(prevBlocks => {
              return (prevBlocks.map(block => {
                  if(block.id === patternBlockID[0]){
                      return (reveal(block))
                  } else {
                      return (block)
                  }
                })
              )})
              setDisplayOrder(prevState => !prevState)
          } else {
            setTimeout(() => {
              setBlocks(prevBlocks => {
                  return (prevBlocks.map(block => {
                      if(block.id === patternBlockID[currentPatternIndex-1]){
                          return (reveal(block))
                      } else {
                          return (block)
                      }
                    })
                  )})
                  setDisplayOrder(prevState => !prevState)
          }, patternFlashTime)
          } 
        currentPatternIndex ++
    } else {
      setTimeout(() => {
        setDisabled(false)
      }, patternFlashTime - 2);
    }
    setTimeout(() => {
      unreveal()
    }, patternFlashTime - 2);
  }
}, [displayOrder])

  const resetTurn = () => {
    setUserCurrentChoice(null)
  }

  const incorrectChoice = () => {
    setBlocks(prevBlocks => {
      return (prevBlocks.map(block => {
        if (userCurrentChoice.id === block.id) {
          health.current --
          if (health.current === 0) {
            setTimerOn(false)
            setGameOver(true)
            submit(level)
          }
          return ({...block, clicked: true})
        } else {
          return (block)
        }
      })
      )})
  }

  // compare user's choice with pattern
  useEffect(() => {
    if (userCurrentChoice){
      if (patternBlockID.includes(userCurrentChoice.id)) {
        setBlocks(prevBlocks => {
          return (prevBlocks.map(block => {
            if (userCurrentChoice.id === block.id) {
              if(order) {
                if(userCurrentChoice.id === patternBlockID[numMatched]){
                  numMatched = numMatched + 1
                  return ({...block, matched: true, clicked: true})
                } else {
                  health.current --
                  if (health.current === 0) {
                    setTimerOn(false)
                    setGameOver(true)
                    submit(level)
                  }
                  return ({...block, flash: true})
                }
              } else {
                numMatched = numMatched + 1
                return ({...block, matched: true, clicked: true})
              }
            } else {
              return (block)
            }
          })
          )})
        resetTurn()
      } else {  
        incorrectChoice()
        resetTurn()
      }
    }
  
    if (numMatched === numberOfPatternBlocks) {
      setDisabled(true)
      setVictory(true)
      setLevel(prevLevel => prevLevel + 1)
      currentPatternIndex = 0
    }

    setTimeout(() => {
      blocks.forEach(block => block.flash = false)
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrentChoice])

  // when a round is won
  useEffect(() => {
    if (victory){
      // detect if it has reached last level (using every block as pattern)
      if(level === totalNumberOfBlocks){
        setGameOver(true)
      } else {
        setTimeout(() => {
          generatePattern()
        }, 500);
      }
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

  const victoryAnimation = () => {
    if(victory){
      return("pattern-game-victory")
    } else if(gameOver) {
      return ("pattern-game-over")
    } else {
      return ("pattern-game")
    }
  }

  // style for dynamic grid size of equal width and height
  const patternGridStyle = () => {

    let columnSize = '10vh '.repeat(gameDim)
    return({'gridTemplateColumns': columnSize})
  }

  return (
    <div className={victoryAnimation()}>
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
          {[...Array(health.current)].map((e, i) => <span className="pattern-game__heart" key={i}></span>)}
          {[...Array(maxHealth - health.current)].map((e, i) => <span className="pattern-game__black-heart" key={i}></span>)}
          </div>         
      </div>
        <h2 className="pattern-game__timerText">{time}</h2>
        <h2>Score: {level}</h2>
      </div>
      {gameOver ? 
        <div className='game-over-div'>
          <h2 className="game-over-text">Your score: {level}</h2>
          <button onClick={next}>Next Question</button>
        </div> : null
      }
      <div className='pattern-game__blocks-grid' style={patternGridStyle()}>
        {blocks.map(block => (
          <SingleBlock 
            key={block.id} 
            block={block} 
            handleChoice={handleChoice}
            blockState={currentBlockState(block)}
            gameOver={gameOver}
            disabled={disabled}
            flash={block.flash}
            clicked={block.clicked}
            />
        ))}
      </div>
    </div>
  );
}

export default PatternGame;

