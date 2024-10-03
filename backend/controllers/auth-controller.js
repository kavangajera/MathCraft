const User = require("../models/user");

const basicAuthMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const { userId } = req.params;
  
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send('Missing or invalid Authorization Header');
    }
  
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');                                                              
  
    try {
      
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).send('User not found');
      }
  
      
      if (user.username !== username || user.password !== password) {
        return res.status(401).send('Invalid credentials');
      }
  
      
      next();
    } catch (err) {
      console.log(err)
      return res.status(500).send('Authentication failed, please try again later');
    }
  };
  
  exports.basicAuthMiddleware = basicAuthMiddleware