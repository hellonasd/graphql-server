const jwt = require('jsonwebtoken');

//token-model
const tokenModel = require('../shema/token');

class TokenServise {
    async generateTokones(payload){
        
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {expiresIn: '40m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, {expiresIn: '5h'});

        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenDate = await tokenModel.findOne({user : userId});
        if(tokenDate){
            tokenDate.refreshToken = refreshToken
            await tokenDate.save();
        }
        const token = await tokenModel.create({user : userId, refreshToken});
        return token;
    }
}

module.exports = new TokenServise();