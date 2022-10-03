import "../styles/Editor.css";
import { FaSave, FaTrash } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import axiosAPICaller from "../services/api-service.mjs";

const iconSize = "1.25em";
const baseURL = "http://localhost:3001/api"; // change later for prod with .env

const Editor = (props) => {
  const { userData, isTest } = props;
  const { testId, questionId } = useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    title: "",
    description: "",
    published: false,
    timeLimit: null,
    noTimeLimit: false,
    linearProgression: false,
    image: "",
    category: "",
    type: "",
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

  useEffect(() => {
    const fetchData = async () => {
      await axiosAPICaller
        .get(
          `${baseURL}/${isTest ? `test/${testId}` : `question/${questionId}`}`
        )
        .then((response) => {
          setSettings({
            ...settings,
            title: response.data.title,
            published: response.data.published,
            description: response.data.description,
            category: response.data.category,
            image: response.data.image,
          });
        });
    };

    // only fetch if there is something to fetch
    if (testId !== "create" && questionId !== "create") {
      fetchData();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axiosAPICaller.post(
      `${baseURL}/${isTest ? "test" : "question"}`,
      isTest
        ? {
            title: settings.title,
            creator: userData.name,
            published: settings.published,
          }
        : {
            title: settings.title,
            description: settings.description,
            image: settings.image,
            category: settings.category,
          }
    );
    navigate(-1);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await axios.delete(
      `${baseURL}/${isTest ? `test/${testId}` : `question/${questionId}`}`
    );
    navigate(-1);
  };

  useEffect(() => {
    console.log(settings);
  }, [settings]);

  return (
    <form className="editor" onSubmit={(e) => handleSubmit(e)}>
      <h1>Create / Edit {isTest ? "Test" : "Question"}</h1>
      <div className="divider" />
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
        {isTest ? (
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
            <label>Linear Progression</label>
            <input
              type="checkbox"
              style={{ width: "min-content" }}
              defaultChecked={settings.linearProgression}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  linearProgression: e.target.checked,
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
            {settings.category !== "MEMORY" ? (
              <>
                <label>Image</label>
                <div className="editor__image-container">
                  <input
                    type="file"
                    onChange={(e) => {
                      setSettings({
                        ...settings,
                        image: URL.createObjectURL(e.target.files[0]),
                      });
                    }}
                    required
                  />
                  <img
                    src={settings.image}
                    className="editor__image"
                    alt="Preview of question diagram"
                  />
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
              <option value="VISUALISATION">Visualisation</option>
              <option value="ROTATION">Rotation</option>
              <option value="PERCEPTION">Perception</option>
              <option value="MEMORY">Memory</option>
            </select>
            <label>Type</label>
            <select
              onChange={(e) =>
                setSettings({ ...settings, type: e.target.value })
              }
              defaultValue={settings.type}
              required
            >
              {settings.category === "MEMORY" ? (
                <>
                  <option value="MATCH">Match</option>
                  <option value="PATTERN">Pattern</option>
                </>
              ) : (
                <>
                  <option value="TEXT">Text</option>
                  <option value="MULTI">Multichoice</option>
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
