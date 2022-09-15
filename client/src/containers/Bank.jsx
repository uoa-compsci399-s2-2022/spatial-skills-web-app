import React, { useState } from "react";
import "../styles/Bank.css";
import Questions from "./questions.json";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Bank = () => {
  const [optionValue, setOptionValue] = useState("All");
  const [data, setData] = useState("");
  const handleSelect = (e) => {
    setOptionValue(e.target.value);
  };
  function getInput(val) {
    setData(val.target.value);
  }

  return (
    <div>
      <div className="bank-left-panel">
        <h2>Questions</h2>
        <select
          name="Category"
          id="category"
          onChange={handleSelect}
          className="bank-input-select"
        >
          <option value="All">All</option>
          <option value="Spatial Memory">Spatial Memory</option>
          <option value="Visuospatial Perception">
            Visuospatial Perception
          </option>
          <option value="Mental Rotation">Mental Rotation</option>
          <option value="Spatial Visualisation">Spatial Visualisation</option>
        </select>
        <input type="text" className="bank-input" onChange={getInput}></input>
      </div>

      <div className="bank-right-panel">
        <h1>Question Bank</h1>
        <hr />
        {Questions &&
          Questions.map((question) => {
            if (
              (question.category === optionValue || optionValue === "All") &&
              question.title.toLowerCase().includes(data.toLowerCase())
            ) {
              return (
                <div className="bank-test-elements">
                  <Link to={`/dashboard/bank/editor/${question._id}`}>
                    <button
                      onClick={() => console.log(`EDIT "${question.title}"`)}
                    >
                      <img
                        className="bank-test-button"
                        alt="QuestionImage"
                        src={question.image}
                      ></img>
                    </button>
                  </Link>
                  <div className="bank-test-text">
                    <h4>{question.title}</h4>
                    <h5>{question.category}</h5>
                    <button
                      className="bank-remove-button"
                      title="Remove"
                      onClick={() => console.log(`REMOVE "${question.title}"`)}
                    >
                      X
                    </button>
                  </div>
                </div>
              );
            }
          })}

        <div className="bank-test-elements">
          <Link to="/dashboard/bank">
            <div className="bank-test-button">
              <FaPlus size="5rem" />
            </div>
          </Link>
          <div className="bank-test-text">
            <h4>Create Question</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bank;
