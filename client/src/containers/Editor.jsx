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
    timeLimit: null,
    noTimeLimit: false,
    allowBackTraversal: false,
    shuffleTestQuestions: false,
    shuffleMCQAnswers: false,
    image: "",
    question: null,
    category: "",
    type: "",
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
  });
  const MODE = code === "create" || questionId === "create" ? "CREATE" : "EDIT";
  const CONTEXT = questionId === undefined ? "TEST" : "QUESTION";

  useEffect(() => {
    const fetchData = async () => {
      await axiosAPICaller
        .post(
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
            type: response.data.questionType,
            timeLimit: response.data.totalTime,
            allowBackTraversal: response.data.allowBackTraversal,
          });
        });
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    window.scrollTo(0, 0);
    let noErrors = true;
    const data = {
      title: settings.title,
      description: settings.description,
      category: settings.category,
      questionType: settings.type,
      creator: userData.name,
      answer: settings.answer,
      question: settings.question,
      citation: settings.citation,
      published: settings.published,
      totalTime: settings.timeLimit,
    };
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
          data,
          config
        )
        .catch((e) => {
          setError(e.response.status);
          noErrors = false;
        });
    } else {
      await axiosAPICaller.post(
        `${baseURL}/${CONTEXT === "TEST" ? `test` : `question`}`,
        data,
        config
      );
    }

    // Only navigate back if there is no errors
    if (noErrors) {
      navigate(-1);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await axiosAPICaller.delete(`${baseURL}/question/${questionId}`);
    navigate(-1);
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
                setSettings({ ...settings, type: e.target.value })
              }
              defaultValue={settings.type}
              required
            >
              <option selected={settings.type === ""}>
                Select question type
              </option>

              {settings.category === "MEMORY" ? (
                <>
                  <option value="DYNAMIC-MEMORY">Match</option>
                  <option value="DYNAMIC-PATTERN">Pattern</option>
                </>
              ) : (
                <>
                  <option value="TEXT" selected={settings.type === "TEXT"}>
                    Text
                  </option>
                  <option
                    value="MULTICHOICE"
                    selected={settings.type === "MULTICHOICE"}
                  >
                    Multichoice
                  </option>
                </>
              )}
            </select>
            {settings.category === "MEMORY" ? (
              <>
                <label>Grid Size</label>
                <input
                  type="text"
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
            ) : settings.type === "MULTI" ? (
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
          type="text"
          placeholder="60"
          className="editor__input editor__input"
          disabled={settings.noTimeLimit}
          defaultValue={settings.timeLimit}
          onChange={(e) =>
            setSettings({ ...settings, timeLimit: e.target.value })
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
          Save
          <FaSave size={iconSize} />
        </button>
      </div>
    </form>
  );
};

export default Editor;
