const userModel = require("../../shema/user");

//todoModel

const todoModel = require("../../shema/todo");

const getUsers = async () => {
  const user = await userModel.find();
  return user;
};

const getTodo = async (email) => {
  const { todo } = await userModel
    .findOne({ email })
    .populate({ path: "todo", options : {sort : {'created' : -1}}})
    .lean();

  const obj = todo.sort((a, b) => {
    if (a.favorite === b.favorite) {
      if (a.completed === b.completed) {
        return a.created.toString().localeCompare(b.created.toString);
      }
      return a.completed > b.completed ? 1 : -1;
    }
    return b.favorite > a.favorite ? 1 : -1;
  });
  const data = obj.map((el) => {
    return {
      id: el._id,
      message: el.message,
      favorite: el.favorite,
      completed: el.completed,
      created: el.created,
    };
  });
  return data;
};

const createTask = async (email, message, favorite, completed) => {
  const todo = await userModel.findOne({ email }).populate({ path: "todo" });

  const todoCreated = await todoModel.create({
    message,
    completed,
    favorite,
    created: Date.now(),
  });

  todo.todo.push(todoCreated);
  todo.save();
  return todoCreated;
};

module.exports = { getUsers, getTodo, createTask };
