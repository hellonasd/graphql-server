const todoModel = require("../shema/todo");
class TodoService {
  async deleteTodo(id) {
    const todo = await todoModel.findByIdAndRemove({ _id: id });
    if (todo) {
      return todo;
    } else {
      throw new Error("не смогли найти задачу");
    }
  }
  async findAndUpdateTask(input) {
    const { id, message, favorite, completed } = input;

    const todo = await todoModel.findByIdAndUpdate(
      { _id: id },
      { $set: { message, favorite, completed } },
      { new: true }
    );
    
    return {
      id: todo._id,
      message: todo.message,
      favorite: todo.favorite,
      completed: todo.completed,
      created : todo.created
    };
  }
}

module.exports = new TodoService();
