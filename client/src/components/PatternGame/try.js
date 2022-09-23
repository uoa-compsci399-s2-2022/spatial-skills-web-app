import { useEffect, useState } from 'react'
import './try.css'

let index = 0
const blockArray = [{"id": 1, 'clName': 'green'}, 
                    {"id": 2, 'clName': 'green'},
                    {"id": 3, 'clName': 'green'}]

const TrialComp = () => {

    const [blocks, setBlocks] = useState(blockArray)
    const [green, setGreen] = useState(true)

    const unreveal = () => {
        setBlocks(prevBlocks => {
          return (prevBlocks.map(block => {
              return ({...block, clName:'green'})
            })
          )})
      }

    useEffect(() => {
        if(index <= 2) {
            setTimeout(() => {
                setBlocks(prevBlocks => {
                    return (prevBlocks.map(block => {
                        console.log(index)
                        if(block.id == index){
                            return ({...block, clName: 'red'})
                        } else {
                            return (block)
                        }
                      })
                    )})
                setGreen(prevState => !prevState)
            }, 600);
            index ++ 
        }     
    }, [green])

    setTimeout(() => {
        unreveal()
    }, 600);


    return(
        <div>
            {blocks.map(block => {
                return (
                    <div key={block.id} className={block.clName}></div>
                )
            })}
        </div>
    )



}

export default TrialComp;