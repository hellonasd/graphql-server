const userModel = require('../shema/user');

//service-user
const userService = require('../service/user-service');

class UserController{
    async registration(req,res,next){
        const { name, email, password } = req.body;
        const user = await userService.registration(name, email, password);
        
        res.json(user);
    }
    async login(){

    }

    async logout(){

    }
}


module.exports = new UserController();