import { useParams } from "react-router-dom";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import "../styles/Stats.css";
import axios from "axios";
import React from "react";
import {
  FaSave,
  FaTrash,
  FaEdit,
  FaShareAlt,
  FaDownload,
} from "react-icons/fa";

const iconSize = "1.25em";

const Stats = () => {
  const { testId } = useParams();
  const [isLoadedTest, setIsLoadedTest] = React.useState(false);
  const [isLoadedQuestion, setIsLoadedQuestion] = React.useState(false);
  const baseURL = "http://localhost:3001/api/test/all";
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    axios.get(baseURL).then((response) => {
      setData(response.data);
      setIsLoadedTest(true);
    });
  }, []);

  const test = data.filter((test) => test._id === testId)[0];

  const qURL = "http://localhost:3001/api/question/all";
  const [questionData, setQuestionData] = React.useState([]);

  React.useEffect(() => {
    axios.get(qURL).then((response) => {
      setQuestionData(response.data);
      setIsLoadedQuestion(true);
    });
  }, []);

  if(isLoadedTest && isLoadedQuestion){
    return (
      <div className="stats">
        <h1>{test.title}</h1>
        <h3>{test.code}</h3>

        <div className="divider" />

        <div className="stats__row">
          <div className="stats__col" style={{ width: "65%" }}>
            <div className="stats__section section">
              <h2>Questions</h2>
              <div className="divider" />
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
                {test && test.questions.map((question) => {
                  return (
                  questionData && questionData.map((_question) => {
                    if(question.qId === _question._id){
                          return (
                            <tr key={question._id}>
                              <img
                                alt=""
                                src={_question.image}
                                class="stats__image"
                              />
                              <td>{_question.title}</td>
                              <td>{`${question.time}s`}</td>
                              <td>{question.grade.toFixed(1)}</td>
                            </tr>
                          );
                    }
                  })
                )})}
                </tbody>
              </table>
              <div className="stats__action-container">
                <Link
                  className="button button--outlined"
                  title="Edit"
                  to={`/dashboard/test/${testId}/question`}
                >
                  Edit
                  <FaEdit size={iconSize} />
                </Link>
              </div>
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
                      <td>{student.sId}</td>
                      <td>{student.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="button button--outlined">
                Download as .csv
                <FaDownload size={iconSize} />
              </button>
            </div>
          </div>
        </div>
        <div className="divider" />

        <div className="stats__action-container">
          <button
            className="button button--caution"
            title="Delete"
            style={{ marginRight: "auto" }}
          >
            Delete
            <FaTrash size={iconSize} />
          </button>
          <Link
            to={`/dashboard/test/${testId}`}
            className="button button--outlined"
          >
            Edit
            <FaEdit size={iconSize} />
          </Link>
          <button
            className="button button--outlined"
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
          <button className="button button--filled" title="Save">
            Save
            <FaSave size={iconSize} />
          </button>
        </div>
      </div>
    );
  }
};

export default Stats;