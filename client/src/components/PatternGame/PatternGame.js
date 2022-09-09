import { useEffect, useState } from 'react'
import "./PatternGame.css";
import SingleBlock from './SingleBlock';


const gameDim = 6
const numberOfPatternBlocks = 6

// create blocks array
const CreateBlockArray = (dimension) => {
  const bArray = []
  for (let i = 0; i < dimension * dimension; i++) {
    bArray.push({"id": i, "pattern": false, "matched": false, "clicked": false})
  }
  return bArray
}
const blocksArray = CreateBlockArray(gameDim)


function PatternGame() {
  const totalNumberOfBlocks = gameDim * gameDim
  const [blocks, setBlocks] = useState(blocksArray)
  const [patternBlocks, setPatternBlocks] = useState([])
  const [userCurrentChoice, setUserCurrentChoice] = useState(null)
  const [numberOfChoices, setNumberOfChoices] = useState(0)

    
  // create pattern array marked by its key
  const generatePattern = () => {
    blocks.map(block => {
      block.pattern = false
      block.matched = false
      block.clicked = false
      return(null)
    })
    
    // get an random array of IDs
    const generatePatternIDs = (length, numPatternBlocks) => {
      let randomIDsarray = Array.from(Array(numPatternBlocks).keys())
      .sort(() => Math.random() - 0.5)
      console.log(randomIDsarray.slice(0, length))
      return(randomIDsarray.slice(0, length))
    }
    
    const patternIDs = generatePatternIDs(numberOfPatternBlocks, totalNumberOfBlocks)
    
    // update block property if it's chosen to be the question pattern
    for(let i = 0; i < totalNumberOfBlocks; i++){
      for (let x = 0; x < numberOfPatternBlocks; x++){
        if (blocks[i].id === patternIDs[x]){
          blocks[i].pattern = true
        }
      }
    }

    setPatternBlocks(patternIDs)
  }

  console.log(patternBlocks)

  // handle user's choice
  const handleChoice = (block) => {
    setUserCurrentChoice(block)
  }

  const currentBlockState = (block) => {
    if (block.pattern && block.matched) {
      return ("correct")
    } else if (block.clicked === true && block.matched === false) {
      return ("incorrect")
    } else {
      return ("nothing")
    }
  }


  const resetTurn = () => {
    setUserCurrentChoice(null)
  }

  useEffect(() => {
    if (userCurrentChoice){
      if (patternBlocks.includes(userCurrentChoice.id)) {
        setBlocks(prevBlocks => {
          return (prevBlocks.map(block => {
            if (userCurrentChoice.id === block.id) {
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
              return ({...block, clicked: true})
            } else {
              return (block)
            }
          })
          )})
    
        resetTurn()
      }
    }


  }, [userCurrentChoice])

  console.log(blocks)

  return (
    <div className="game">
      <button onClick={generatePattern}>Start</button>


      <div className='game__blocks-grid'>
        {blocks.map(block => (
          <SingleBlock 
            key={block.id} 
            block={block} 
            handleChoice={handleChoice}
            blockState={currentBlockState(block)}
            />
        ))}
      </div>

    </div>
  );
}

export default PatternGame;

