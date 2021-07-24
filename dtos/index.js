module.exports = class Dtos {
    id;
    email;
    name;
    todo;
    constructor(model){
        this.id = model._id,
        this.email = model.email;
        this.name = model.name;
        this.todo = model.todo;
    }
}