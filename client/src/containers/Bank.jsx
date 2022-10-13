import React, { useState, useEffect } from "react";
import "../styles/Bank.css";
import { Link, useParams } from "react-router-dom";
import { FaPlus, FaGamepad } from "react-icons/fa";
import axiosAPICaller from "../services/api-service.mjs";

const iconSize = "1.25em";
const Bank = () => {
  const { code } = useParams();
  const [optionValue, setOptionValue] = useState("All");
  const [isLoadedQuestion, setIsLoadedQuestion] = useState(false);
  const [isLoadedTest, setIsLoadedTest] = useState(false);
  const [data, setData] = useState("");
  const handleSelect = (e) => {
    setOptionValue(e.target.value);
  };

  const qURL = "http://localhost:3001/api/question/all";
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    axiosAPICaller.get(qURL).then((response) => {
      setQuestionData(response.data);
      setIsLoadedQuestion(true);
    });
  }, []);

  const tURL = "http://localhost:3001/api/test/code/" + code;
  const [testData, setTestData] = useState([]);

  useEffect(() => {
    axiosAPICaller.get(tURL).then((response) => {
      setTestData(response.data);
      setIsLoadedTest(true);
    });
  }, []);

  const Questions = testData.questions;
  const QuestionList = questionData;

  if (isLoadedQuestion && isLoadedTest) {
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
            <option value="MEMORY">Memory</option>
            <option value="PERCEPTION">Perception</option>
            <option value="ROTATION">Rotation</option>
            <option value="VISUALISATION">Visualisation</option>
          </select>
          <label>Name</label>
          <input
            type="text"
            className="editor__input"
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
                return (
                  QuestionList &&
                  QuestionList.map((_question) => {
                    if (question.qId === _question._id || code === "bank") {
                      if (
                        (_question.category === optionValue ||
                          optionValue === "All") &&
                        _question.title
                          .toLowerCase()
                          .includes(data.toLowerCase())
                      ) {
                        if(_question.category !== "MEMORY"){
                          return (
                            <Link
                              className="dashboard__item section"
                              to={`/dashboard/test/${testId}/question/${_question._id}`}
                            >
                              <img
                                alt=""
                                src={_question.image}
                                className="bank__question"
                              />
                              <div className="bank__test-text">
                                <h4>{_question.title}</h4>
                                <p>{_question.category}</p>
                              </div>
                            </Link>
                          );

                        } else {
                          return (
                            <Link
                              className="dashboard__item section"
                              to={`/dashboard/test/${testId}/question/${_question._id}`}
                            >
                              <FaGamepad class="bank-game__question"/>
                              <div className="bank__test-text">
                                <h4>{_question.title}</h4>
                                <p>{_question.category}</p>
                              </div>
                            </Link>
                          );
                        }
                      }
                    }
                  })
                );
              })}
            <Link
              to={`/dashboard/test/${code}/question/create`}
              className="dashboard__create"
            >
              <FaPlus size={iconSize} />
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

export default Bank;
