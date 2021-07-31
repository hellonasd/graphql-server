const jwt = require('jsonwebtoken');
module.exports = (t) => {
  // const { token } = req.cookies;
  // console.log('token', token)
  // if (token) {
  //   const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
  //   return user;
  // }
  // next();
  const token = t.split(' ')[1];
  if(token){
    const user = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    
    return user;
  }
  
  return 'токен не прошел проверку'
};
