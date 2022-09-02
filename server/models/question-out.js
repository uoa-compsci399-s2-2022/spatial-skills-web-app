
class QuestionOut {
    constructor(question){
        this.title = question.title;
        this.description = question.description;
        this.image = question.image;
        this.answer = question.answer.map((a)=>({id: a.id, 
            image: a.image}))
    }
}

export default QuestionOut