
class QuestionOut {
    constructor(question){
        this.id = question.id;
        this.title = question.title;
        this.description = question.description;
        this.image = question.image;
        this.answer = question.answer.map((a)=>({id: a.id, 
            image: a.image}));
        this.categroy = question.categroy;
    }
}

export default QuestionOut