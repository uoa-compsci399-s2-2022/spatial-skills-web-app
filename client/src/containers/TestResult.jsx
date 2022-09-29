import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Test Marking proof of concept.

const TestResult = () => {
  let { tId, sId } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const url = "http://localhost:3001/api/answer/getStudentAnswer";
  const body = {
    tId: tId,
    sId: sId,
  };

  useEffect(() => {
    axios.post(url, body).then(
      (res) => {
        console.log(res);
        setData(res.data);
        setIsLoaded(true);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      }
    );
  }, []);

  const renderAnswers = () => {
    const answers = data.testQuestions.map((ans) => {
      return (
        <li key={ans.qId}>
          <img src={ans.image} alt="Answer" />
          <p>Category: {ans.category}</p>
          <p>Description: {ans.description}</p>
          <p>Grade: {ans.grade}</p>
          <p>{ans.correct ? "Correct" : "Wrong"}</p>
          <p>Value: {ans.value}</p>
        </li>
      );
    });
    return answers;
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading Test...</div>;
  } else {
    return (
      <div className="results">
        <div>
          <h1>Test Result Page</h1>
          <h1>Test Name: {data.testTitle}</h1>
          <h1>Student Name: {data.sId}</h1>
          <h1>
            Grade: {data.studentGrade} / {data.testMaxGrade}
          </h1>
          <ol type="1">{renderAnswers()}</ol>
        </div>
      </div>
    );
  }
};

export default TestResult;
