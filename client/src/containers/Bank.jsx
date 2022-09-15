import React, { useState } from "react";
import "../styles/Bank.css";
import Questions from "./questions.json";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
const iconSize = "1.25em";
const Bank = () => {
  const [optionValue, setOptionValue] = useState("All");
  const [data, setData] = useState("");
  const handleSelect = (e) => {
    setOptionValue(e.target.value);
  };

  return (
    <div className="bank">
      <div className="bank__side">
        <h3>Filter by</h3>
        <label>Category</label>
        <select
          name="Category"
          id="category"
          onChange={handleSelect}
          style={{ width: "100%" }}
        >
          <option value="All">All</option>
          <option value="Spatial Memory">Spatial Memory</option>
          <option value="Visuospatial Perception">
            Visuospatial Perception
          </option>
          <option value="Mental Rotation">Mental Rotation</option>
          <option value="Spatial Visualisation">Spatial Visualisation</option>
        </select>
        <label>Name</label>
        <input
          type="text"
          className="bank__search"
          onChange={(e) => setData(e.target.value)}
          placeholder="Search"
        />
      </div>

      <div className="bank__main">
        <h1>Bank</h1>
        <div className="divider" />
        <div className="bank__question-grid">
          {Questions &&
            Questions.map((question) => {
              if (
                (question.category === optionValue || optionValue === "All") &&
                question.title.toLowerCase().includes(data.toLowerCase())
              ) {
                return (
                  <Link
                    className="dashboard__test section"
                    to={`/dashboard/bank/editor/${question._id}`}
                  >
                    <img
                      alt=""
                      src={question.image}
                      className="bank__question"
                    />
                    <div className="bank__test-text">
                      <h4>{question.title}</h4>
                      <p>{question.category}</p>
                    </div>
                  </Link>
                );
              }
            })}
          <Link to="/dashboard/bank" className="dashboard__create">
            <FaPlus size={iconSize} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Bank;
