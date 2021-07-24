//model-user
const userModel = require("../shema/user");
//bcrypt
const bcrypt = require("bcrypt");
//token-service
const tokenServise = require("./token-service");

//dtos
const Dtos = require("../dtos");

class UserService {
  async registration(name, email, password) {
    const candidate = await userModel.findOne({ email });

    if (candidate) {
      throw new Error(`пользователь с таким email уже существует : ${email} `);
    }
    const hashPassword = await bcrypt.hash(password, 4);
    const user = await userModel.create({
      name,
      email,
      password: hashPassword,
    });
    const userDtos = new Dtos(user);

    const tokens = await tokenServise.generateTokones({ ...userDtos });
    await tokenServise.saveToken(userDtos.id, tokens.refreshToken);
    return {
      user: userDtos,
      ...tokens,
    };
  }
  async login(email, password) {
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(`пользователья с таким email не существует`);
    }

    const equalPassword = await bcrypt.compare(password, user.password);
    if (!equalPassword) {
      throw new Error(`неверный пароль`);
    }
    const userDto = new Dtos(user);
    const tokens = await tokenServise.generateTokones({
      ...userDto,
    });
    
    await tokenServise.saveToken(userDto.id, tokens.refreshToken);
    return {
      user: userDto,
      ...tokens,
    };
  }
}

module.exports = new UserService();
