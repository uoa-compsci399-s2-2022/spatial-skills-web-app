import "../styles/Editor.css";
import { FaSave, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { useLocation } from "react-router-dom";
const iconSize = "1.25em";
const Editor = () => {
  const [type, setType] = useState(null);
  const location = useLocation().pathname;
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="editor" onSubmit={(e) => handleSubmit(e)}>
      <h1>Create / Edit + Question</h1>
      <div className="divider" />
      <div className="editor__grid">
        <label for="category">Category</label>
        <select id="category" required>
          <option>Visualisation</option>
          <option>Rotation</option>
          <option>Perception</option>
          <option>Memory</option>
        </select>
        <label for="type">Type</label>
        <select id="type" onChange={(e) => setType(e.target.value)} required>
          <option value="text">Text input</option>
          <option value="multi">Multichoice</option>
        </select>
        <label for="name">Name</label>
        <input
          type="text"
          placeholder="Name"
          id="name"
          className="editor__input"
          required
        />
        <label for="text">Text</label>
        <textarea
          id="text"
          rows="5"
          placeholder="Place question prompt here"
          className="editor__input"
          required
        />
        <label for="image">Image</label>
        <input type="file" id="image" required />
        <label for="time">Time</label>
        <div className="editor__row">
          <input
            type="text"
            placeholder="60"
            className="editor__time-limit editor__input"
            required
          />
          <p style={{ fontSize: "0.8rem" }}>seconds</p>
        </div>
        <label for="no-time-limit">No time limit</label>
        <input
          type="checkbox"
          id="no-time-limit"
          style={{ width: "min-content" }}
        />
      </div>
      <div className="divider" />

      {type === "multi" ? (
        <div className="editor__answer-grid">
          {[1, 2, 3, 4].map((index) => (
            <div className="editor__grid editor__answer" key={index}>
              <label>Answer</label>
              <label>{index}</label>
              <label for={`grade-${index}`}>Grade</label>
              <input
                id={`grade-${index}`}
                type="text"
                placeholder="1.0"
                required
              />
              <label for={`image-${index}`}>Image</label>
              <input type="file" id={`image-${index}`} required />
            </div>
          ))}
        </div>
      ) : (
        <div className="editor__grid">
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
            className="editor__input"
            placeholder="1.0"
            required
          />
        </div>
      )}
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
