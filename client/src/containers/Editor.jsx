import "../styles/Editor.css";
import { FaSave, FaTrash } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosAPICaller from "../services/api-service.mjs";

const iconSize = "1.25em";
const baseURL = "http://localhost:3001/api"; // change later for prod with .env
const errorTree = {
  403: "ERROR: Unauthorized!",
};

const Editor = (props) => {
  const [error, setError] = useState(null);
  const { userData } = props;
  const { code, questionId } = useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    title: "",
    description: "",
    published: false,
    totalTime: null,
    noTimeLimit: false,
    allowBackTraversal: false,
    shuffleAnswers: false,
    shuffleQuestions: false,
    image: "",
    question: null,
    category: "",
    questionType: "",
    citation: "",
    multi: [],
    answer: "",
    grade: null,
    size: null,
    order: true,
    lives: null,
    previewDuration: null,
    randomLevelOder: false,
    seed: "",
    creator: userData.name,
    gameStartDelay: null,
    selectionDelay: null,
  });
  const MODE = code === "create" || questionId === "create" ? "CREATE" : "EDIT";
  const CONTEXT = questionId === undefined ? "TEST" : "QUESTION";

  useEffect(() => {
    const fetchData = async () => {
      await axiosAPICaller
        .get(
          `${baseURL}/${
            CONTEXT === "TEST" ? `test/code/${code}` : `question/${questionId}`
          }`
        )
        .then((response) => {
          console.log(response.data);
          setSettings({
            ...settings,
            title: response.data.title,
            published: response.data.published,
            description: response.data.description,
            category: response.data.category,
            image: response.data.image,
            answer: response.data.answer,
            citation: response.data.citation,
            questionType: response.data.questionType,
            totalTime: response.data.totalTime,
            allowBackTraversal: response.data.allowBackTraversal,
            shuffleAnswers: response.data.shuffleAnswers,
            shuffleQuestions: response.data.shuffleQuestions,
          });
        });
    };
    if (MODE === "EDIT") {
      fetchData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    let noErrors = true;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    if (MODE === "EDIT") {
      await axiosAPICaller
        .patch(
          `${baseURL}/${
            CONTEXT === "TEST" ? `test/code/${code}` : `question/${questionId}`
          }`,
          settings,
          config
        )
        .catch((e) => {
          setError(e.response.status);
          noErrors = false;
        });
    } else {
      await axiosAPICaller.post(
        `${baseURL}/${CONTEXT === "TEST" ? `test` : `question`}`,
        settings,
        config
      );
    }

    // Only navigate back if there is no errors
    if (noErrors) {
      navigate("/dashboard");
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await axiosAPICaller.delete(
      `${baseURL}/${
        CONTEXT === "TEST" ? `test/code/${code}` : `question/${questionId}`
      }`
    );
    navigate("/dashboard");
  };

  useEffect(() => {
    console.log(settings);
  }, [settings]);

  return (
    <form className="editor" onSubmit={(e) => handleSubmit(e)}>
      <h1>{`${MODE === "CREATE" ? "Create" : "Edit"} ${
        CONTEXT === "TEST" ? "Test" : "Question"
      }`}</h1>
      <div className="divider" />
      {error !== null ? (
        <p className="editor__error">
          <MdError size={iconSize} />
          {errorTree[error]}
        </p>
      ) : null}

      <div className="editor__grid">
        <label>Title</label>
        <input
          type="text"
          placeholder="Title"
          className="editor__input"
          onChange={(e) => setSettings({ ...settings, title: e.target.value })}
          defaultValue={settings.title}
          required
        />
        {CONTEXT === "TEST" ? (
          <>
            <label>Published</label>
            <input
              type="checkbox"
              style={{ width: "min-content" }}
              defaultChecked={settings.published}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  published: e.target.checked,
                });
              }}
            />
            <label>Back Traversal</label>
            <input
              type="checkbox"
              style={{ width: "min-content" }}
              defaultChecked={settings.allowBackTraversal}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  allowBackTraversal: e.target.checked,
                });
              }}
            />
            <label>Shuffle Answers</label>
            <input
              type="checkbox"
              style={{ width: "min-content" }}
              defaultChecked={settings.shuffleAnswers}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  shuffleAnswers: e.target.checked,
                });
              }}
            />
            <label>Shuffle Questions</label>
            <input
              type="checkbox"
              style={{ width: "min-content" }}
              defaultChecked={settings.shuffleQuestions}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  shuffleQuestions: e.target.checked,
                });
              }}
            />
          </>
        ) : (
          <>
            <label>Description</label>
            <textarea
              defaultValue={settings.description}
              onChange={(e) =>
                setSettings({ ...settings, description: e.target.value })
              }
              rows="5"
              placeholder="Enter question prompt here"
              className="editor__input"
              required
            />
            <label>Citation</label>
            <input
              type="text"
              placeholder="Citation"
              className="editor__input"
              onChange={(e) =>
                setSettings({ ...settings, citation: e.target.value })
              }
              defaultValue={settings.citation}
            />
            {settings.category !== "MEMORY" ? (
              <>
                <label>Image</label>
                <div className="editor__image-container">
                  <input
                    type="file"
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        question: e.target.files[0],
                        image: URL.createObjectURL(e.target.files[0]),
                      });
                    }}
                    required={MODE === "CREATE"}
                  />
                  {settings.image !== "" ? (
                    <img
                      src={settings.image}
                      className="editor__image"
                      alt=""
                    />
                  ) : null}
                </div>
              </>
            ) : null}
            <label>Category</label>
            <select
              onChange={(e) =>
                setSettings({ ...settings, category: e.target.value })
              }
              required
              defaultValue={settings.category}
            >
              <option selected={settings.category === ""}>
                Select question category
              </option>
              <option
                value="VISUALISATION"
                selected={settings.category === "VISUALISATION"}
              >
                Visualisation
              </option>
              <option
                value="ROTATION"
                selected={settings.category === "ROTATION"}
              >
                Rotation
              </option>
              <option
                value="PERCEPTION"
                selected={settings.category === "PERCEPTION"}
              >
                Perception
              </option>
              <option value="MEMORY" selected={settings.category === "MEMORY"}>
                Memory
              </option>
            </select>
            <label>Type</label>
            <select
              onChange={(e) =>
                setSettings({ ...settings, questionType: e.target.value })
              }
              defaultValue={settings.questionType}
              required
            >
              <option selected={settings.questionType === ""}>
                Select question type
              </option>

              {settings.category === "MEMORY" ? (
                <>
                  <option value="DYNAMIC-MEMORY">Match</option>
                  <option value="DYNAMIC-PATTERN">Pattern</option>
                </>
              ) : (
                <>
                  <option
                    value="TEXT"
                    selected={settings.questionType === "TEXT"}
                  >
                    Text
                  </option>
                  <option
                    value="MULTICHOICE-SINGLE"
                    selected={settings.questionType === "MULTICHOICE-SINGLE"}
                  >
                    Multichoice
                  </option>
                  <option
                    value="MULTICHOICE-MULTI"
                    selected={settings.questionType === "MULTICHOICE-MULTI"}
                  >
                    Multiple Response
                  </option>
                </>
              )}
            </select>
            {settings.category === "MEMORY" ? (
              <>
                <label>Grid Size</label>
                <input
                  type="number"
                  placeholder="5"
                  className="editor__input editor__input"
                  onChange={(e) =>
                    setSettings({ ...settings, size: e.target.value })
                  }
                  required
                />
                <label>Preview Duration</label>
                <input
                  type="text"
                  placeholder="1"
                  className="editor__input editor__input"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      previewDuration: e.target.value,
                    })
                  }
                  required
                />
                <label>Seed</label>
                <input
                  type="text"
                  placeholder="SEED"
                  className="editor__input editor__input"
                  onChange={(e) =>
                    setSettings({ ...settings, seed: e.target.value })
                  }
                  required
                />
                <label>Lives</label>
                <input
                  type="text"
                  placeholder="3"
                  className="editor__input editor__input"
                  onChange={(e) =>
                    setSettings({ ...settings, lives: e.target.value })
                  }
                  required
                />
                <label>Ordered</label>
                <input
                  type="checkbox"
                  style={{ width: "min-content" }}
                  defaultChecked={settings.order}
                  onChange={(e) => {
                    setSettings({ ...settings, order: e.target.checked });
                  }}
                />
              </>
            ) : settings.questionType.includes("MULTICHOICE") ? (
              <>
                <label>Number of Answers</label>
                <input
                  type="text"
                  placeholder="4"
                  className="editor__input editor__input"
                  required
                />
                {[1, 2, 3, 4].map((index) => (
                  <>
                    <label>Grade</label>
                    <input
                      type="text"
                      placeholder="1.0"
                      className="editor__input editor__input"
                      required
                    />
                    <label>Image</label>
                    <input type="file" required />
                  </>
                ))}
              </>
            ) : (
              <>
                <label>Answer</label>
                <input
                  type="text"
                  className="editor__input"
                  placeholder="e.g. 17"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      answer: e.target.value,
                    })
                  }
                  defaultValue={settings.answer}
                  required
                />
                <label>Grade</label>
                <input
                  type="text"
                  className="editor__input editor__input"
                  placeholder="1.0"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      grade: e.target.value,
                    })
                  }
                  defaultValue={settings.grade}
                  required
                />
              </>
            )}
          </>
        )}
        <label>Time Limit</label>
        <input
          type="number"
          placeholder="60"
          className="editor__input editor__input"
          disabled={settings.noTimeLimit}
          defaultValue={settings.totalTime}
          onChange={(e) =>
            setSettings({ ...settings, totalTime: parseInt(e.target.value) })
          }
          required
        />
        <label>No Time limit</label>
        <input
          type="checkbox"
          style={{ width: "min-content" }}
          defaultChecked={settings.noTimeLimit}
          onChange={(e) => {
            setSettings({ ...settings, noTimeLimit: e.target.checked });
          }}
        />
      </div>
      <div className="divider" />
      <div className="editor__action-container">
        <button
          className="button button--caution"
          onClick={(e) => handleDelete(e)}
        >
          Delete
          <FaTrash size={iconSize} />
        </button>
        <button className="button button--filled">
          {MODE === "EDIT" ? "Save" : "Create"}
          <FaSave size={iconSize} />
        </button>
      </div>
    </form>
  );
};

export default Editor;
