import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from "axios";

// Test Marking proof of concept.

const TestResult = () => {
  let { tId, sId } = useParams();
  const [userAnswers, setUserAnswers] = useState(null);
  const [grade, setGrade] = useState(null);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const url = 'http://localhost:3001/api/answer/getStudentAnswer';
  const data = {
    tId: tId,
    sId: sId
  };

  useEffect(() => {
    axios.post(url, data)
    .then((res) => {
      console.log(res);
      setUserAnswers(res.data.answers);
      setGrade(res.data.grade);
      setIsLoaded(true);
    },
    (error) => {
      setIsLoaded(true);
      setError(error);
    })
  }, [])

  const renderAnswers = () => {
    const answers = userAnswers.map((ans) => {
      return (
        <li key={ans.qId}>
          {ans.correct ? 'Correct' : 'Wrong'} Value: {ans.value}
        </li>
      )
    })
    return answers;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading Test...</div>;
  } else {
    return (
      <div className='results'>
        <div>
          <h1>Test Result Page</h1>
          <h1>Test {tId}</h1>
          <h1>Taken by {sId}</h1>
          <h1>Grade: {grade}</h1>
          <ol type="1">
            {renderAnswers()}
          </ol>
        </div>
      </div>
    )
  }
}


export default TestResult;
