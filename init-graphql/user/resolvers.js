const { getUsers, getTodo, createTask } = require("./model");
const userService = require("../../service/user-service");
//todo-service
const todoService = require("../../service/todo-service");

const pubSub = require("../../pubSub/pubSub");

const { withFilter } = require("graphql-subscriptions");

//events
const events = require("./events");

module.exports = resolvers = {
  Query: {
    users: (_, __, ctx) => {
      if (ctx.user) {
        return getUsers();
      } else {
        throw new Error(`вы не авторизованы`);
      }
    },
    getAllTodo: async (_, __, ctx) => {
      if (ctx.user) {
        const { email } = ctx.user;
        const usr = await getTodo(email);
        pubSub.publish(events.ALL_TODO, {
          all: usr,
        });

        return usr
      } else {
        throw new Error("авторизируйтесь пожалуйста");
      }
    },
  },
  Mutation: {
    createTodo: async (_, { message, favorite, completed }, ctx) => {
      if (ctx.user) {
        const { email } = ctx.user;
        const usr = await createTask(email, message, favorite, completed);
        const todos = await getTodo(email);
        todos.unshift(usr);
        pubSub.publish(events.CREATE_TODO, {
          createTodo: usr,
        });
        pubSub.publish(events.ALL_TODO, {
          all: todos,
        });
        
        return usr;
      } else {
        throw new Error("вы не авторизованы, что бы создавать задачу");
      }
    },
    registration: async (_, { email, password, name }, ctx) => {
      const user = await userService.registration(name, email, password);
      const newRegUser = user.user;
      const accessToken = user.accessToken;
      pubSub.publish(events.ALL_TODO, {
        all: await getTodo(email),
      });
      return {
        ...newRegUser,
        accessToken,
      };
    },
    login: async (_, { email, password }, ctx) => {
      const user = await userService.login(email, password);
      const loginUser = user.user;
      const accessToken = user.accessToken;
      pubSub.publish(events.ALL_TODO, {
        all: await getTodo(email),
      });
      return {
        ...loginUser,
        accessToken,
      };
    },
    deleteTodo: async (_, { id }, ctx) => {
      if (ctx.user) {
        const { email } = ctx.user;
        const { _id, message, completed, favorite } =
          await todoService.deleteTodo(id);
        pubSub.publish(events.ALL_TODO, {
          all: await getTodo(email),
        });
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
      if (ctx.user) {
        const { email } = ctx.user;
        
        const todo = await todoService.findAndUpdateTask(input);
        pubSub.publish(events.ALL_TODO, {
          all: await getTodo(email),
        });
        return todo;
      } else {
        throw new Error("вы не авторизованы");
      }
    },
    logout: (_, __, ctx) => {
      return "вы вышли";
    },
  },
  Subscription: {
    all: {
      subscribe: withFilter(
       () => pubSub.asyncIterator([events.ALL_TODO]),
        (payload, variables) => {
          return payload.all ? true : false;
        }
      ),
    },
    createTodo: {
      subscribe: withFilter(
        () => pubSub.asyncIterator([events.CREATE_TODO]),
        (payload, variables) => {
          return payload.createTodo ? true : false;
        }
      ),
    },
  },
};
