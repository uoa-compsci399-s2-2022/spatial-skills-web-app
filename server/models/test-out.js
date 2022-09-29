class TestOut {
  constructor(test) {
    this.title = test.title;
    this.creator = test.creator;
    this.questions = test.questions;
    this.published = test.published;
    this.code = test.code;
    this.allowBackTraversal = test.allowBackTraversal;
    this.totalTime = test.totalTime;
  }
}

export default TestOut;
