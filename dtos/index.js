module.exports = class Dtos {
    id;
    email;
    name;
    constructor(model){
        this.id = model._id,
        this.email = model.email;
        this.name = model.name;
    }
}