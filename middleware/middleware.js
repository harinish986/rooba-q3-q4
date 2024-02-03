const Middleware = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const accessToken = req.headers.authorization || 'No Access Token';
  
    const logMessage = `[${timestamp}] Method: ${method}, URL: ${url}, AccessToken: "${accessToken}"`;
    console.log(logMessage);
  
    next();
  };
  
  module.exports = Middleware;