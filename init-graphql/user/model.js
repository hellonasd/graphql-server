const userModel = require("../../shema/user");

//todoModel

const todoModel = require("../../shema/todo");

const getUsers = async () => {
  const user = await userModel.find();
  return user;
};

const getTodo = async (email) => {

  const user = await userModel.findOne({ email }).populate('todo').select('__v');
  return user.todo;
};

const createTask = async (email, message, favorite, completed) => {
  const todo = await userModel.findOne({ email }).populate({ path: "todo"});
  
  const todoCreated = await todoModel.create({
    message,
    completed,
    favorite,
  });
  // let obj = {
  //   id : todoCreated._id,
  //   message : todoCreated.message,
  //   favorite : todoCreated.favorite,
  //   completed : todoCreated.completed
  // }
  todo.todo.push(todoCreated);
  todo.save();
  return todo.todo;
};

module.exports = { getUsers, getTodo, createTask };
