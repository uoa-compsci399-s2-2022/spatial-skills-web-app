import "../styles/Editor.css";
import { FaSave, FaTrash } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosAPICaller from "../services/api-service.mjs";
import Return from "../components/Return";

const iconSize = "1.25em";

const baseURL = "";
const errorTree = {
  403: "ERROR: Unauthorized!",
};
const mutliAnswerMap = ["a", "b", "c", "d", "e"];

const Editor = (props) => {
  const [error, setError] = useState(null);
  const [published, setPublished] = useState(false);
  const { userData } = props;
  const { code, questionId } = useParams();
  const navigate = useNavigate();
  const MODE = code === "create" || questionId === "create" ? "CREATE" : "EDIT";
  const CONTEXT = questionId === undefined ? "TEST" : "QUESTION";
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
    answer: "",
    textGrade: null,
    size: null,
    lives: null,
    seed: null,
    corsi: false,
    reverse: false,
    randomLevelOrder: false,
    patternFlashTime: null,
    creator: userData.name,
    gameStartDelay: null,
    selectionDelay: null,
    testCode: code,
    a: null,
    aImage: "",
    aGrade: null,
    b: null,
    bImage: "",
    bGrade: null,
    c: null,
    cImage: "",
    cGrade: null,
    d: null,
    dImage: "",
    dGrade: null,
    e: null,
    eImage: "",
    eGrade: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      await axiosAPICaller
        .get(
          `${baseURL}/${
            CONTEXT === "TEST" ? `test/code/${code}` : `question/${questionId}`
          }`
        )
        .then((response) => {
          let newSettings = {
            ...settings,
            ...response.data,
          };
          if (CONTEXT === "TEST") {
            newSettings = {
              ...newSettings,
              totalTime: response.data.totalTime.$numberDecimal,
            };
          } else if (response.data.questionType === "TEXT") {
            newSettings = {
              ...newSettings,
              textGrade: response.data.textGrade.$numberDecimal,
              totalTime: response.data.totalTime.$numberDecimal,
            };
          }
          if (response.data.multi !== undefined) {
            response.data.multi.map((it, index) => {
              newSettings[`${mutliAnswerMap[index]}Image`] = it.image;
              newSettings[`${mutliAnswerMap[index]}Grade`] =
                it.grade.$numberDecimal;
            });
          }
          setPublished(response.data.published);
          setSettings(newSettings);
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
      navigate(-1);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    await axiosAPICaller.delete(
      `${baseURL}/${
        CONTEXT === "TEST" ? `test/code/${code}` : `question/${questionId}`
      }`
    );
    if (CONTEXT === "TEST") {
      navigate("/dashboard");
    }
    navigate(-1);
  };

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
              checked={settings.published}
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
              checked={settings.allowBackTraversal}
              onChange={(e) => {
                setSettings({
                  ...settings,
                  allowBackTraversal: e.target.checked,
                  individualTime: !e.target.checked,
                });
              }}
            />
            <label>Shuffle Answers</label>
            <input
              type="checkbox"
              style={{ width: "min-content" }}
              checked={settings.shuffleAnswers}
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
              checked={settings.shuffleQuestions}
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
                    disabled={MODE === "EDIT"}
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
              disabled={MODE === "EDIT"}
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
              disabled={MODE === "EDIT"}
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
                  <option
                    selected={settings.questionType === "DYNAMIC-MEMORY"}
                    value="DYNAMIC-MEMORY"
                  >
                    Match
                  </option>
                  <option
                    selected={settings.questionType === "DYNAMIC-PATTERN"}
                    value="DYNAMIC-PATTERN"
                  >
                    Pattern
                  </option>
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
                  defaultValue={settings.size}
                  onChange={(e) =>
                    setSettings({ ...settings, size: e.target.value })
                  }
                  required
                />
                <label>Seed</label>
                <input
                  type="number"
                  placeholder="12345"
                  className="editor__input editor__input"
                  defaultValue={settings.seed}
                  onChange={(e) =>
                    setSettings({ ...settings, seed: e.target.value })
                  }
                  required
                />
                <label>Lives</label>
                <input
                  type="number"
                  placeholder="3"
                  className="editor__input editor__input"
                  defaultValue={settings.lives}
                  onChange={(e) =>
                    setSettings({ ...settings, lives: e.target.value })
                  }
                  required
                />
                {settings.questionType === "DYNAMIC-PATTERN" ? (
                  <>
                    <label>Corsi</label>
                    <input
                      type="checkbox"
                      style={{ width: "min-content" }}
                      checked={settings.corsi}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          corsi: e.target.checked,
                        });
                      }}
                    />
                    <label>Reverse</label>
                    <input
                      type="checkbox"
                      style={{ width: "min-content" }}
                      checked={settings.reverse}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          reverse: e.target.checked,
                        });
                      }}
                    />
                    <label>Random Level Order</label>
                    <input
                      type="checkbox"
                      style={{ width: "min-content" }}
                      checked={settings.randomLevelOrder}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          randomLevelOrder: e.target.checked,
                        });
                      }}
                    />
                    <label>Pattern Flash Time</label>
                    <input
                      type="number"
                      placeholder="1"
                      className="editor__input editor__input"
                      defaultValue={settings.patternFlashTime}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          patternFlashTime: e.target.value,
                        })
                      }
                      required
                    />
                  </>
                ) : (
                  <>
                    <label>Start Delay</label>
                    <input
                      type="number"
                      placeholder="1"
                      className="editor__input editor__input"
                      defaultValue={settings.gameStartDelay}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          gameStartDelay: e.target.value,
                        })
                      }
                      required
                    />
                    <label>Selection Delay</label>
                    <input
                      type="number"
                      placeholder="1"
                      className="editor__input editor__input"
                      defaultValue={settings.selectionDelay}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          selectionDelay: e.target.value,
                        })
                      }
                      required
                    />
                  </>
                )}
              </>
            ) : settings.questionType.includes("MULTICHOICE") ? (
              mutliAnswerMap.map((it) => (
                <>
                  <label
                    style={{ gridColumn: "span 2" }}
                  >{`${it.toUpperCase()}`}</label>
                  <label>Grade</label>
                  <input
                    type="number"
                    className="editor__input editor__input"
                    placeholder="1.0"
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [`${it}Grade`]: e.target.value,
                      })
                    }
                    defaultValue={settings[`${it}Grade`]}
                  />
                  <label>Image</label>
                  <div className="editor__image-container">
                    <input
                      disabled={MODE === "EDIT"}
                      type="file"
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          [it]: e.target.files[0],
                          [`${it}Image`]: URL.createObjectURL(
                            e.target.files[0]
                          ),
                        });
                      }}
                    />
                    {settings[it] !== "" ? (
                      <img
                        src={settings[`${it}Image`]}
                        className="editor__image"
                        alt=""
                      />
                    ) : null}
                  </div>
                </>
              ))
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
                  type="number"
                  className="editor__input editor__input"
                  placeholder="1.0"
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      textGrade: e.target.value,
                    })
                  }
                  defaultValue={settings.textGrade}
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
            setSettings({ ...settings, totalTime: e.target.value })
          }
          required
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
        <button
          className="button button--filled"
          style={{ display: published ? "none" : "default" }}
        >
          {MODE === "EDIT" ? "Save" : "Create"}
          <FaSave size={iconSize} />
        </button>
      </div>
      <Return />
    </form>
  );
};

export default Editor;
