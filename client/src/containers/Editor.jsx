import "../styles/Editor.css";
import { FaSave, FaTrash, FaQuestionCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosAPICaller from "../services/api-service.mjs";
import Return from "../components/Return";
import Help from "../components/Help";

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
    order: false,
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
          const newSettings = { ...settings, ...response.data };
          [
            "totalTime",
            "textGrade",
            "patternFlashTime",
            "gameStartDelay",
            "selectionDelay",
          ].forEach((it) => {
            try {
              newSettings[it] = response.data[it].$numberDecimal;
            } catch (error) {}
          });
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
          title="The name of the test/question."
          type="text"
          placeholder="Title"
          className="editor__input"
          onChange={(e) => setSettings({ ...settings, title: e.target.value })}
          defaultValue={settings.title}
          required
        />
        <Help content="The name of the question/test" disabled />
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
            <Help
              content="Students can only do published tests.
             Publishing a test will disable the ability to edit said test!"
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
            <Help
              content="
                Enabling this setting will allow students to freely view different 
                questions without answering the previous questions. Enabling this 
                setting will also disable the individual time setting for each 
                question. The total quiz duration will be decided by the 
                `Time Limit` field instead.
            "
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
            <Help
              content="Enabling this setting will shuffle the order of multi-answer questions."
              disabled
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
            <Help content="Enabling this setting will shuffle the question order for each student." />
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
            <Help
              content="The question prompt displayed with the question."
              disabled
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
            <Help content="Reference to original source." />
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
                <Help content="The question image." disabled />
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
            <Help
              content="The area within the spatial memory field being used for this question."
              disabled
            />
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
            <Help content="The user input method for the question." />
            {settings.category === "MEMORY" ? (
              <>
                <label>
                  {settings.questionType === "DYNAMIC-MEMORY"
                    ? "Number of Pairs"
                    : "Grid Size"}
                </label>
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
                <Help
                  content="The number of rows/columns within the game space for the pattern game,
                            or number of pairs of cards in matching game"
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
                <Help
                  content="The seed used to generate any random variables of the game"
                  disabled
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
                <Help
                  content="The number of failed selections before ending the game."
                  disabled
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
                    <Help
                      content="
                      Enabling this setting will convert this question into a 
                      traditional 'Corsi Block Tapping' test. This test has 9 
                      blocks spaced out in random positions. MANY settings will 
                      be igored if enabled.
                      "
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
                    <Help content="Enabling this setting will require students to repeat the pattern in reverse order." />
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
                    <Help
                      content="
                      Enabling this setting will randomise each pattern in the 
                      sequence, otherwise the pattern will build upon the previous 
                      sequence.
                      "
                    />
                    <label>Pattern in Order</label>
                    <input
                      type="checkbox"
                      style={{ width: "min-content" }}
                      checked={settings.order}
                      onChange={(e) => {
                        setSettings({
                          ...settings,
                          order: e.target.checked,
                        });
                      }}
                    />
                    <Help
                      content="
                      Enabling this setting will display each block one by one 
                      in order, otherwise it will display the entire 
                      pattern at once.
                      "
                    />
                    <label>{"Pattern Flash Time (s)"}</label>
                    <input
                      type="number"
                      step="any"
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
                    <Help content="How long a pattern is revealed for." />
                  </>
                ) : (
                  <>
                    <label>{"Start Delay (s)"}</label>
                    <input
                      type="number"
                      step="any"
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
                    <Help content="Time delay between revealing all cards and the start of the game." />
                    <label>{"Selection Delay (s)"}</label>
                    <input
                      type="number"
                      step="any"
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
                    <Help content="Time delay after revealing two selected cards." />
                  </>
                )}
              </>
            ) : settings.questionType.includes("MULTICHOICE") ? (
              mutliAnswerMap.map((it) => (
                <>
                  <label
                    style={{ gridColumn: "span 3" }}
                  >{`${it.toUpperCase()}`}</label>
                  <label>Grade</label>
                  <input
                    type="number"
                    step="any"
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
                  <Help content="Grade for the potential answer" disabled />
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
                  <Help content="Image of the potential answer" disabled />
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
                <Help
                  content="Answer of the question. e.g. 13, B, A, etc."
                  disabled
                />
                <label>Grade</label>
                <input
                  type="number"
                  step="any"
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
                <Help
                  content="The grade for answering this question correctly"
                  disabled
                />
              </>
            )}
          </>
        )}
        <label>{"Time Limit (s)"}</label>
        <input
          type="number"
          step="any"
          placeholder="60"
          className="editor__input editor__input"
          disabled={settings.noTimeLimit}
          defaultValue={settings.totalTime}
          onChange={(e) =>
            setSettings({ ...settings, totalTime: e.target.value })
          }
          required
        />
        <Help content="The time limit for the question/test." disabled />
      </div>
      <div className="divider" />
      <div className="editor__action-container">
        <button
          className="button button--filled"
          style={{ display: published ? "none" : "default" }}
        >
          {MODE === "EDIT" ? "Save" : "Create"}
          <FaSave size={iconSize} />
        </button>
        <button
          className="button button--caution"
          onClick={(e) => handleDelete(e)}
        >
          Delete
          <FaTrash size={iconSize} />
        </button>
      </div>
      <Return />
    </form>
  );
};

export default Editor;
