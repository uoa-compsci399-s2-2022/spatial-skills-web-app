import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import "../styles/Stats.css";
import { useEffect, useState } from "react";
import { FaEdit, FaShareAlt, FaDownload } from "react-icons/fa";
import axiosAPICaller from "../services/api-service.mjs";

const iconSize = "1.25em";

const Stats = () => {
  const { code } = useParams();
  const [isLoadedTest, setIsLoadedTest] = useState(false);
  const [isLoadedQuestion, setIsLoadedQuestion] = useState(false);
  const baseURL = "http://localhost:3001/api/test/all";
  const [data, setData] = useState([]);

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

  if (isLoadedTest && isLoadedQuestion) {
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
                  {test &&
                    test.questions.map((question) => {
                      return (
                        questionData &&
                        questionData.map((_question) => {
                          if (question.qId === _question._id) {
                            return (
                              <tr key={question._id}>
                                <td>
                                  <img
                                    alt=""
                                    src={_question.image}
                                    className="stats__image"
                                  />
                                </td>
                                <td>{_question.title}</td>
                                <td>{`${question.time}s`}</td>
                                <td>{_question.grade}</td>
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
