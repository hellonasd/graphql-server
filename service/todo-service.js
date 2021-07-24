const todoModel = require("../shema/todo");
class TodoService {
  async deleteTodo(id, ctx) {
    const todo = await todoModel.findOneAndDelete({ _id: id });
    if (user) {
      return todo;
    } else {
      throw new Error("не смогли найти задачу");
    }
  }
  async findAndUpdateTask(input) {
    const {id, message, favorite, completed} = input;
    const todo = await todoModel.findOneAndUpdate({_id : id}, {$set : {message, favorite, completed}}, {new : true});
    return {
      id : todo._id,
      message : todo.message,
      favorite : todo.favorite,
      completed : todo.completed
    };
  }
}

module.exports = new TodoService();
