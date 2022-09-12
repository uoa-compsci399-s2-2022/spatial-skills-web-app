import "../styles/Editor.css";
import Tests from "./tests.json";
import { Link } from "react-router-dom";


const Editor = () => {

  return (
  <div>
    <div className="editor-left-panel">
      <h2>All Tests</h2>
    </div>

    <div className="editor-right-panel">
    <h1>All Tests</h1>
    <hr />
    {
      Tests && Tests.map(test => {
        return(
          <Link to={{
            pathname: "/dashboard/editor/test",
            search: test._id
          }}>
            <button className="editor__test-button">
              {test.title}
            </button>
         
            </Link>
        )
      })
    }
    </div>
  </div>
  )
};

export default Editor;
