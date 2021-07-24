const { getUsers, getTodo, createTask } = require("./model");
const userService = require("../../service/user-service");
//todo-service
const todoService = require("../../service/todo-service");
module.exports = resolvers = {
  Query: {
    users: (_, __, ctx) => {
      if (ctx.req.user) {
        return getUsers();
      } else {
        throw new Error(`вы не авторизованы`);
      }
    },
    getAllTodo: (_, __, ctx) => {
      if (ctx.req.user) {
        const { email } = ctx.req.user;
        return getTodo(email);
      } else {
        throw new Error("авторизируйтесь пожалуйста");
      }
    },
  },
  Mutation: {
    createTodo: (_, { message, favorite, completed }, ctx) => {
      if (ctx.req.user) {
        const { email } = ctx.req.user;
        return createTask(email, message, favorite, completed);
      } else {
        throw new Error("вы не авторизованы, что бы создавать задачу");
      }
    },
    registration: async (_, { email, password, name }, ctx) => {
      const user = await userService.registration(name, email, password);
      const newRegUser = user.user;
      const accessToken = user.accessToken;
      ctx.req.session.token = accessToken;
      return {
        ...newRegUser,
        accessToken,
      };
    },
    login: async (_, { email, password }, ctx) => {
      const user = await userService.login(email, password);
      const loginUser = user.user;
      const accessToken = user.accessToken;
      ctx.req.session.token = accessToken;

      return {
        ...loginUser,
        accessToken,
      };
    },
    deleteTodo: async (_, { id }, ctx) => {
      if (ctx.req.user) {
        const { _id, message, completed, favorite } =
          await todoService.deleteTodo(id);
        return {
          id: _id,
          message,
          completed,
          favorite,
        };
      } else {
        throw new Error("вы не авторизованы");
      }
    },
    findAndUpdateTask: async (_, { input }, ctx) => {
      if (ctx.req.user) {
        const todo = await todoService.findAndUpdateTask(input);
        return todo;
      } else {
        throw new Error("вы не авторизованы");
      }
    },
    logout: (_, __, ctx) => {
      ctx.req.session.destroy();
      return "вы вышли";
    },
  },
};
