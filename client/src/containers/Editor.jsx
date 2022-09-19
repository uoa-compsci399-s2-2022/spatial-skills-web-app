import "../styles/Editor.css";
import { FaSave, FaTrash } from "react-icons/fa";
import { useState } from "react";
const iconSize = "1.25em";
const Editor = (props) => {
  const { isTest } = props;
  const [type, setType] = useState(null);
  const [category, setCategory] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <form className="editor" onSubmit={(e) => handleSubmit(e)}>
      <h1>Create / Edit {isTest ? "Test" : "Question"}</h1>
      <div className="divider" />
      <div className="editor__grid">
        <label for="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          className="editor__input"
          required
        />
        <label for="time">Time</label>
        <input
          type="text"
          placeholder="60"
          className="editor__input--small editor__input"
          required
        />
        <label for="no-time-limit">No time limit</label>
        <input
          type="checkbox"
          id="no-time-limit"
          style={{ width: "min-content" }}
        />
        {isTest ? (
          <>
            <label>Linear Progression</label>
            <input
              type="checkbox"
              id="no-time-limit"
              style={{ width: "min-content" }}
            />
          </>
        ) : (
          <>
            <label for="text">Text</label>
            <textarea
              id="text"
              rows="5"
              placeholder="Place question prompt here"
              className="editor__input"
              required
            />
            {category !== "memory" ? (
              <>
                <label for="image">Image</label>
                <input type="file" id="image" required />
              </>
            ) : null}
            <label for="category">Category</label>
            <select
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="visual">Visualisation</option>
              <option value="rotation">Rotation</option>
              <option value="perception">Perception</option>
              <option value="memory">Memory</option>
            </select>
            <label for="type">Type</label>
            <select
              id="type"
              onChange={(e) => setType(e.target.value)}
              required
            >
              {category === "memory" ? (
                <>
                  <option value="card">Card</option>
                  <option value="block">Block</option>
                </>
              ) : (
                <>
                  <option value="text">Text input</option>
                  <option value="multi">Multichoice</option>
                </>
              )}
            </select>
            {category === "memory" ? (
              <>
                <label>Size</label>
                <input
                  type="text"
                  placeholder="5"
                  className="editor__input editor__input--small"
                  required
                />
                <label>Preview Duration</label>
                <input
                  type="text"
                  placeholder="5"
                  className="editor__input editor__input--small"
                  required
                />
                <label>Matches</label>
                <input
                  type="text"
                  placeholder="5"
                  className="editor__input editor__input--small"
                  required
                />
              </>
            ) : type === "multi" ? (
              <>
                <label>Number of Answers</label>
                <input
                  type="text"
                  placeholder="4"
                  className="editor__input editor__input--small"
                  required
                />
                {[1, 2, 3, 4].map((index) => (
                  <>
                    <label for={`grade-${index}`}>Grade</label>
                    <input
                      id={`grade-${index}`}
                      type="text"
                      placeholder="1.0"
                      className="editor__input editor__input--small"
                      required
                    />
                    <label for={`image-${index}`}>Image</label>
                    <input type="file" id={`image-${index}`} required />
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
                  required
                />
                <label>Grade</label>
                <input
                  type="text"
                  className="editor__input editor__input--small"
                  placeholder="1.0"
                  required
                />
              </>
            )}
          </>
        )}
      </div>
      <div className="divider" />
      <div className="editor__action-container">
        <button className="button button--caution">
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
