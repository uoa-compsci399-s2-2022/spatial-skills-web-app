import { useEffect, useRef, useState } from "react";
import "../../styles/Memory.css";
import SingleBlock from "./SingleBlock";
import seedrandom from "seedrandom";

function PatternGame({
  corsi,
  gameDim,
  order,
  reverse,
  maxHealth,
  timerState,
  timeAllowed,
  patternFlashTime,
  randomLevelOrder,
  randomSeed = null,
  description,
  changeState,
  tested,
  next,
  submit,
  firstVisit,
}) {
  console.log(tested);

  if (order) {
    patternFlashTime = patternFlashTime * 1000;
  } else {
    patternFlashTime = patternFlashTime * 1000 + 300; // pause between levels
  }

  // create blocks array
  const CreateBlockArray = (numberOfBlocks) => {
    const bArray = [];
    for (let i = 0; i < numberOfBlocks; i++) {
      bArray.push({
        id: i,
        pattern: false,
        matched: false,
        clicked: false,
        flash: false,
      });
    }
    return bArray;
  };

  let totalNumberOfBlocks;

  if (corsi) {
    totalNumberOfBlocks = 9;
  } else {
    totalNumberOfBlocks = gameDim * gameDim;
  }

  let levelList;

  let randomNumber = seedrandom(randomSeed);
  let randomSeedArray = [];
  let blocksArray;

  if (corsi) {
    levelList = Array.from({ length: totalNumberOfBlocks }, (_, i) => i + 1);

    blocksArray = CreateBlockArray(totalNumberOfBlocks);
  } else {
    levelList = Array.from({ length: totalNumberOfBlocks }, (_, i) => i + 1);

    blocksArray = CreateBlockArray(totalNumberOfBlocks);
  }

  for (let i = 0; i < totalNumberOfBlocks; i++) {
    randomSeedArray.push(randomNumber());
  }

  const [blocks, setBlocks] = useState(blocksArray);
  const [patternBlockID, setPatternBlockIDs] = useState([]);
  const [userCurrentChoice, setUserCurrentChoice] = useState(null);
  const [victory, setVictory] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [level, setLevel] = useState(0);
  const [time, setTime] = useState(timeAllowed);
  const [timerOn, setTimerOn] = useState(false);
  const [started, setStarted] = useState(false);
  const [displayOrder, setDisplayOrder] = useState(true);
  const health = useRef(maxHealth);
  const currentPatternIndex = useRef(0);
  const numMatched = useRef(0);

  const test = useRef(0);

  const numberOfPatternBlocks = levelList[level];

  // unique random seed for each level (if random pattern wanted)
  let randomPatternSeed = randomSeedArray[level];
  let randomLevel = seedrandom(randomPatternSeed);

  let patternIDArray;
  let startAlready = false;

  // get an random array of IDs
  const generatePatternIDs = (length, numPatternBlocks) => {
    let randomIDsarray = Array.from(Array(numPatternBlocks).keys()).sort(() => {
      if (randomLevelOrder) {
        return randomLevel() - 0.5;
      } else {
        return randomNumber() - 0.5;
      }
    });

    console.log(randomIDsarray);

    return randomIDsarray.slice(0, length);
  };

  // create pattern array marked by its key
  const generatePattern = () => {
    // reset blocks status each round
    blocks.map((block) => {
      block.pattern = false;
      block.matched = false;
      block.clicked = false;
      block.flash = false;
      return null;
    });

    const patternIDs = generatePatternIDs(
      numberOfPatternBlocks,
      totalNumberOfBlocks
    );
    patternIDArray = patternIDs;

    // update block property if it's chosen to be the question pattern
    for (let i = 0; i < totalNumberOfBlocks; i++) {
      for (let x = 0; x < numberOfPatternBlocks; x++) {
        if (blocks[i].id === patternIDs[x]) {
          blocks[i].pattern = true;
        }
      }
    }

    currentPatternIndex.current = 0;

    if (reverse && order) {
      numMatched.current = level;
    } else {
      numMatched.current = 0;
    }

    if (!order) {
      setDisabled(true);
      showPattern(true);

      setTimeout(() => {
        showPattern(false);
        setDisabled(false);
      }, patternFlashTime);
    } else {
      setDisplayOrder((prevState) => !prevState);
    }
    setPatternBlockIDs(patternIDs);
    setVictory(false);
    startAlready = true;
  };

  // handle user's choice
  const handleChoice = (block) => {
    setUserCurrentChoice(block);
  };

  // decide the color of a block
  const currentBlockState = (block) => {
    if (!started) {
      return "";
    }
    if (block.pattern && block.matched) {
      return "correct";
    } else if (
      (block.clicked === true && block.matched === false) ||
      block.flash
    ) {
      return "incorrect";
    } else {
      return "grey";
    }
  };

  const reveal = (block) => {
    let newBlock = { ...block, matched: true, clicked: true };
    return newBlock;
  };

  const unreveal = () => {
    setBlocks((prevBlocks) => {
      return prevBlocks.map((block) => {
        if (block.matched === true && block.clicked === true) {
          return { ...block, matched: false, clicked: false };
        } else {
          return block;
        }
      });
    });
  };

  // show pattern for standard version of game (not ordered)
  const showPattern = (show) => {
    let pause;
    if (show) {
      if (order) {
        pause = 0;
      } else {
        pause = 300;
      }
      setTimeout(() => {
        setTimerOn(true);
        setBlocks((prevBlocks) => {
          return prevBlocks.map((block) => {
            return { ...block, matched: true, clicked: true };
          });
        });
      }, pause);
    } else {
      setBlocks((prevBlocks) => {
        return prevBlocks.map((block) => {
          return { ...block, matched: false, clicked: false };
        });
      });
    }
  };

  // display pattern in order
  useEffect(() => {
    if (!gameOver) {
      if (order) {
        if (currentPatternIndex.current < patternBlockID.length) {
          setDisabled(true);
          setTimeout(() => {
            setTimerOn(true);
            setBlocks((prevBlocks) => {
              return prevBlocks.map((block) => {
                if (
                  block.id === patternBlockID[currentPatternIndex.current - 1]
                ) {
                  return reveal(block);
                } else {
                  return block;
                }
              });
            });
            setDisplayOrder((prevState) => !prevState);
          }, patternFlashTime);
          currentPatternIndex.current++;
        } else {
          setTimeout(() => {
            setDisabled(false);
          }, patternFlashTime - 2);
        }

        setTimeout(() => {
          unreveal();
        }, patternFlashTime - 2);
      }
    } else {
      setTimerOn(false);
    }
  }, [displayOrder]);

  const resetTurn = () => {
    setUserCurrentChoice(null);
  };

  const incorrectChoice = () => {
    setBlocks((prevBlocks) => {
      return prevBlocks.map((block) => {
        if (userCurrentChoice.id === block.id) {
          if (health.current > 0) {
            health.current--;
          }
          if (health.current === 0) {
            setTimerOn(false);
            setGameOver(true);
            submit(level);
          }
          return { ...block, clicked: true };
        } else {
          return block;
        }
      });
    });
  };

  // compare user's choice with pattern
  useEffect(() => {
    if (userCurrentChoice) {
      if (patternBlockID.includes(userCurrentChoice.id)) {
        setBlocks((prevBlocks) => {
          return prevBlocks.map((block) => {
            if (userCurrentChoice.id === block.id) {
              if (order) {
                if (
                  userCurrentChoice.id === patternBlockID[numMatched.current]
                ) {
                  if (reverse) {
                    numMatched.current -= 1;
                  } else {
                    numMatched.current += 1;
                  }
                  return { ...block, matched: true, clicked: true };
                } else {
                  if (health.current > 0) {
                    health.current--;
                  }
                  if (health.current === 0) {
                    setTimerOn(false);
                    setGameOver(true);
                    submit(level);
                  }
                  setDisabled(true);
                  setTimeout(() => {
                    setDisabled(false);
                  }, 400);
                  return { ...block, flash: true };
                }
              } else {
                numMatched.current += 1;
                return { ...block, matched: true, clicked: true };
              }
            } else {
              return block;
            }
          });
        });
        resetTurn();
      } else {
        incorrectChoice();
        resetTurn();
      }
    }

    if (reverse && order) {
      if (numMatched.current < 0) {
        setDisabled(true);
        setVictory(true);
        setLevel((prevLevel) => prevLevel + 1);
      }
    } else {
      if (numMatched.current === numberOfPatternBlocks) {
        setDisabled(true);
        setVictory(true);
        setLevel((prevLevel) => prevLevel + 1);
      }
    }

    setTimeout(() => {
      blocks.forEach((block) => (block.flash = false));
    }, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCurrentChoice]);

  // when a round is won
  useEffect(() => {
    if (victory) {
      // detect if it has reached last level (using every block as pattern)
      if (level === totalNumberOfBlocks) {
        setGameOver(true);
      } else {
        setTimeout(() => {
          generatePattern();
        }, 500);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [victory]);

  // useEffect(() => {

  //   if (gameOver){
  //     // changeState()
  //   }

  // }, [gameOver])

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

  // time up
  useEffect(() => {
    if (time === 0) {
      setTimerOn(false);
      setGameOver(true);
      unreveal();
    }
  }, [time]);

  const startGame = () => {
    setStarted(true);
    submit(0);
    if (!order) {
      setTimeout(() => {
        generatePattern();
      }, 300);
    } else {
      setStarted(true);
      generatePattern();
    }
  };

  const victoryAnimation = () => {
    if (victory) {
      return "memory memory--victory";
    } else if (gameOver) {
      return "memory memory--game-over";
    } else {
      return "memory";
    }
  };

  const displayTimer = () => {
    if (timerState) {
      return <h2 className="memory__timer">{time}</h2>;
    } else {
      return null;
    }
  };

  // style for dynamic grid size of equal width and height
  const patternGridStyleNoCorsi = () => {
    if (corsi) {
      let columnSize = "10vh ".repeat(2);
      return { display: "flex" };
    } else {
      let columnSize = "10vh ".repeat(gameDim);
      return { gridTemplateColumns: columnSize };
    }
  };

  const renderPage = () => {
    if (started) {
      if (corsi) {
        return "corsi-test__blocks-div";
      } else {
        return "pattern-game__blocks-grid";
      }
    } else {
      return "";
    }
  };

  return (
    <div className={victoryAnimation()}>
      {!started ? (
        <div className="memory__instructions">
          <h1>Memory Test: Block Patterns</h1>
          <p>{description}</p>
          <p>Note: once you start, you cannot redo the question!</p>
          {firstVisit ? (
            <button
              className="button button--outlined"
              style={{ fontSize: "1.25rem" }}
              onClick={startGame}
            >
              START
            </button>
          ) : (
            <p style={{ marginTop: "3rem" }}>
              You have already done this question!
            </p>
          )}
        </div>
      ) : null}
      {displayTimer()}
      {gameOver ? (
        <div className="memory__game-over">
          <h2>Game Over!</h2>
          <h3>Your score: {level}</h3>
          {/* <button onClick={next}>Next Question</button> */}
        </div>
      ) : null}
      <div
        className="memory__lives"
        style={{ display: started ? "flex" : "none" }}
      >
        {[...Array(health.current)].map((e, i) => (
          <span className="memory__heart" key={i}></span>
        ))}
        {[...Array(maxHealth - health.current)].map((e, i) => (
          <span className="memory__black-heart" key={i}></span>
        ))}
      </div>
      <div className={renderPage()} style={patternGridStyleNoCorsi()}>
        {blocks.map((block) => (
          <SingleBlock
            key={block.id}
            block={block}
            handleChoice={handleChoice}
            blockState={currentBlockState(block)}
            gameOver={gameOver}
            disabled={disabled}
            flash={block.flash}
            clicked={block.clicked}
            corsiMode={corsi}
          />
        ))}
      </div>
    </div>
  );
}

export default PatternGame;
