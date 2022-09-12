import React, { useState } from 'react';
import "../styles/Editor.css";
import Tests from "./tests.json";
import Questions from "./questions.json";
import {useLocation, Link} from "react-router-dom";



const EditorTest = () => {
  const location = useLocation();
  const id = location.search.slice(1, location.search.length);

  const [optionValue, setOptionValue] = useState("");
  const handleSelect = (e) => {
    setOptionValue(e.target.value);
  };

  return (
    <div>
      <div className="editor-left-panel">
      <h2>All Tests</h2>
      </div>
      <div className="editor-right-panel">
      {
        Tests && Tests.map(test => {
         if(test._id === id){
            return (
              <div>
              <h1>{test.title}</h1>
              <hr />
              <h2>Questions</h2>
              <br></br>
              
              </div>

            )
          }
        })
      }
      
      {
        Tests && Tests.map(test => {
          var count = 0;
          if(test._id === id){
             const question_list = test.questions;
             return(
              <div>
              {
              Questions.map(question =>{ 
                for (const obj of question_list) {
                  if (question._id === obj.qId){
                    count = count + 1;
                    console.log({optionValue});
                    return (
                      <div>
                      <div>
                      <h1>{count}</h1>
                      </div>
                      <div className = "editor__question">
                      Category:&nbsp;&nbsp;
                      
                      <select name="Category" id="category" onChange={handleSelect} className = "editor__input">
                        <option value="1">Spatial Memory</option>
                        <option value="2">Visuospatial Perception</option>
                        <option value="3">Mental Rotation</option>
                        <option value="4">Spatial Visualisation</option>
                      </select>

                      <br></br>
                      <br></br>

                      <form>
                        <label>
                          Question:&nbsp;&nbsp;
                          <input type="text" name="name" className = "editor__input-text"/>
                        </label>
                      </form>

                      <img alt="QuestionImage" src={question.image} className="editor__question-image"></img>
        

                      </div>
                      <Link to={{
                        pathname: "/dashboard/editor/question",
                        search: question._id
                      }}>
                        <button className="editor__edit-button">
                          Edit Question
                        </button>
                    
                        </Link>
                      </div>
                    )
                  }
                }
               })
              }
               <br></br>
               <br></br>
               <br></br>
               <br></br>
               <br></br>
               <br></br>
               </div>
             )
             
          }
        })
      }
    </div>
  </div>
  )
};

export default EditorTest;
