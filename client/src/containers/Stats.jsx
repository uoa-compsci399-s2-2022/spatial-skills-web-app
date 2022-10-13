import { useParams } from "react-router-dom";
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
  FaGamepad,
} from "react-icons/fa";
import axiosAPICaller from "../services/api-service.mjs";
import CsvDownload from 'react-json-to-csv';
import BarChart from 'reactochart/BarChart';
import XYPlot from 'reactochart/XYPlot';
import XAxis from 'reactochart/XAxis';
import YAxis from 'reactochart/YAxis';
import 'reactochart/styles.css';

const iconSize = "1.25em";

const Stats = () => {
  const { code } = useParams();
  const [isLoadedTest, setIsLoadedTest] = useState(false);
  const [isLoadedQuestion, setIsLoadedQuestion] = useState(false);
  const baseURL = "http://localhost:3001/api/test/all";
  const [data, setData] = React.useState([]);
  var csvArray = [];
  var ansArray = [];
  var JSONObject = {};
  var arrayIndex = 0;
  var correct = "";
  var barChartData = [];
  var gradeArray = [];


  React.useEffect(() => {
    axiosAPICaller.get(baseURL).then((response) => {
      setData(response.data);
      setIsLoadedTest(true);
    });
  }, []);

  const test = data.filter((test) => test.code === code)[0];

  const qURL = "http://localhost:3001/api/question/all";
  const [questionData, setQuestionData] = useState([]);

  React.useEffect(() => {
    axiosAPICaller.get(qURL).then((response) => {
      console.log(response.data);
      setQuestionData(response.data);
      setIsLoadedQuestion(true);
    });
  }, []);


  if (isLoadedTest) {
    test.studentAnswers.map((studentAnswers) => 
      {
        return (
          studentAnswers.answers.map((answers) => {
              return (
                ansArray.push(answers)
              );
          })
        );
      }
    )
  }

if (isLoadedTest && isLoadedQuestion) {
  test.studentAnswers.map((studentAnswer) => 
    {
      JSONObject = 
        {
          "Name" : studentAnswer.sId,
          "Grade": studentAnswer.grade,
        }

      for (let i = 0; i < studentAnswer.answers.length; i++) {
        if (ansArray[arrayIndex+i].correct === true){
          correct = "Correct";
        } else {
          correct = "Incorrect";
        }
        JSONObject["Question " + (i+1).toString()] = correct;
      }

      arrayIndex = arrayIndex + studentAnswer.answers.length;
      gradeArray.push(studentAnswer.grade);

      barChartData.push({x: studentAnswer.sId.substring(0, 7), y: studentAnswer.grade});
      
      return (csvArray.push(JSONObject));
        

    }
  )
}


const BarChartWithDefs = (props) => {
  if (isLoadedTest) {
      const data = barChartData;
      return <div>
        <svg width="0" height="0" style={{ position: 'absolute' }}></svg>
        <XYPlot width={1050} height={300}>
          <XAxis title="Students"/>
          <YAxis title="Grade"/>
          <BarChart
            data={data}
            x={d => d.x}
            y={d => d.y}
            barThickness={800/barChartData.length}
          />
        </XYPlot>
        <br></br>
        Mean Grade: {(gradeArray.reduce((a, b) => a + b, 0) / gradeArray.length).toFixed(2)}
        <br></br>
        Median Grade: {gradeArray.sort()[(gradeArray.length/2)]}
      </div>
  }
};



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
              <div className="divider" id="width"/>
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
                            if(_question.category !== "MEMORY"){
                              console.log(question.category);
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
                            } else {
                              return (
                                <tr key={question._id}>
                                  <FaGamepad class="stats__image"/>
                                  <td>{_question.title}</td>
                                  <td>{`${question.time}s`}</td>
                                  <td>{question.grade.toFixed(1)}</td>
                                </tr>
                              );

                            }
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
            
            <BarChartWithDefs width="1000"/>
          
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
              
                <CsvDownload data={csvArray} size={iconSize}><button className="button button--outlined">Download as .csv</button></CsvDownload>
              
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
