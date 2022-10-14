import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Stats.css";
import React, { useEffect, useState } from "react";
import { FaEdit, FaShareAlt, FaGamepad } from "react-icons/fa";
import axiosAPICaller from "../services/api-service.mjs";
import CsvDownload from "react-json-to-csv";
import "reactochart/styles.css";

const iconSize = "1.25em";

const Stats = () => {
  const { code } = useParams();
  const [isLoadedTest, setIsLoadedTest] = useState(false);
  const [isLoadedQuestion, setIsLoadedQuestion] = useState(false);
  const baseURL = "http://localhost:3001/api/test/all";
  const [data, setData] = useState([]);
  var csvArray = [];
  var ansArray = [];
  var JSONObject = {};
  var arrayIndex = 0;
  var correct = "";
  var gradeArray = [];

  useEffect(() => {
    axiosAPICaller.get(baseURL).then((response) => {
      setData(response.data);
      setIsLoadedTest(true);
    });
  }, []);

  const test = data.filter((test) => test.code === code)[0];

  const qURL = "http://localhost:3001/api/question/all";
  const [questionData, setQuestionData] = useState([]);

  useEffect(() => {
    axiosAPICaller.get(qURL).then((response) => {
      console.log(response.data);
      setQuestionData(response.data);
      setIsLoadedQuestion(true);
    });
  }, []);

  if (isLoadedTest) {
    test.studentAnswers.map((studentAnswers) => {
      return studentAnswers.answers.map((answers) => {
        return ansArray.push(answers);
      });
    });
  }

  if (isLoadedTest && isLoadedQuestion) {
    test.studentAnswers.map((studentAnswer) => {
      let name = ""
      let grade = 0
      let percentage = 0
      let time = 0
      if (studentAnswer.studentName !== null && studentAnswer.studentName !== undefined) 
      {name = studentAnswer.studentName}
      if (studentAnswer.totalGrade !== null && studentAnswer.totalGrade !== undefined) 
      {grade = studentAnswer.totalGrade.$numberDecimal}
      if (studentAnswer.totalPercentage !== null && studentAnswer.totalPercentage !== undefined) 
      {percentage = studentAnswer.totalPercentage.$numberDecimal}
      if (studentAnswer.totalTimeTaken !== null && studentAnswer.totalTimeTaken !== undefined) 
      {time = studentAnswer.totalTimeTaken.$numberDecimal}

      console.log("name", name, "grade", grade, "percentage", percentage, "time", time);
      JSONObject = {
        Name: name,
        Grade: grade,
        Percentage: percentage,
        Time: time,
      };

      for (let i = 0; i < studentAnswer.answers.length; i++) {
        console.log(ansArray[arrayIndex + i].grade)
        if (ansArray[arrayIndex + i].grade.$numberDecimal === '1') {
          correct = "Correct";
        } else {
          correct = "Incorrect";
        }
        JSONObject["Question " + (i + 1).toString()] = correct;
      }

      arrayIndex = arrayIndex + studentAnswer.answers.length;
      gradeArray.push(grade);
      return csvArray.push(JSONObject);
    });
  }

  const BarChart = (props) => {
    if (isLoadedTest) {
      return (
        <div>
          Mean Grade:{" "}
          {(gradeArray.reduce((a, b) => a + b, 0) / gradeArray.length).toFixed(
            2
          )}
          <br></br>
          Median Grade: {gradeArray.sort()[gradeArray.length / 2]}
        </div>
      );
    }
  };

  if (isLoadedTest && isLoadedQuestion) {
    console.log("Running")
    return (
      <div className="stats">
        <h1>{test.title}</h1>
        <h3>{test.code}</h3>

        <div className="divider" />

        <div className="stats__row">
          <div className="stats__col" style={{ width: "65%" }}>
            <div className="stats__section section">
              <h2>Questions</h2>
              <div className="divider" id="width" />
              <table>
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Name</th>
                    <th>Time</th>
                    <th>Grade</th>
                  </tr>
                </thead>
                <tbody>
                {test &&
                    test.questions.map((question) => {
                      console.log("Running 2")
                      return (
                        questionData &&
                        questionData.map((_question) => {
                          if (question === _question._id) {
                            let grade = 0;
                            let time = 0;
                            let title = "";
                            if (_question.totalMultiGrade !== null && _question.totalMultiGrade !== undefined){
                              grade = _question.totalMultiGrade.$numberDecimal
                            }
                            if (_question.totalTime !== null && _question.totalTime !== undefined){
                              time = _question.totalTime.$numberDecimal
                            }
                            if (_question.title !== null && _question.title !== undefined){
                              title = _question.title
                            }

                            return (
                              <tr key={_question._id}>
                                <td>
                                  <img
                                    alt=""
                                    src={_question.image}
                                    className="stats__image"
                                  />
                                </td>
                                <td>{title}</td>
                                <td>{`${time}s`}</td>
                                <td>{grade}</td>
                              </tr>
                            );
                          }
                        })
                      );
                    })}
                </tbody>
              </table>
              <div className="stats__action-container">
                <Link
                  className="button button--outlined"
                  title="Edit"
                  to={`/dashboard/test/${code}/question`}
                >
                  Edit
                  <FaEdit size={iconSize} />
                </Link>
              </div>
            </div>

            <div className="barChart">
              
            </div>
          </div>

          <div className="stats__col" style={{ width: "35%" }}>
            <div className="stats__section section">
              <h2>Scores</h2>
              <div className="divider" />
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {test.studentAnswers.map((student) => (
                    <tr key={student._id}>
                      <td>{student.studentName}</td>
                      <td>{student.totalGrade.$numberDecimal}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <CsvDownload data={csvArray} size={iconSize}>
                <button className="button button--outlined">
                  Download as .csv
                </button>
              </CsvDownload>
            </div>
          </div>
        </div>
        <div className="divider" />

        <div className="stats__action-container">
          <Link
            to={`/dashboard/test/${code}`}
            className="button button--outlined"
          >
            Edit
            <FaEdit size={iconSize} />
          </Link>
          <button
            className="button button--filled"
            title="Share"
            onClick={() => {
              navigator.clipboard.writeText(
                `https://www.spatialskills.com?code=${test.code}`
              );
            }}
          >
            Share
            <FaShareAlt size={iconSize} />
          </button>
        </div>
      </div>
    );
  }
};

export default Stats;
