/* eslint-disable strict */
function authenticateToken(req, res, next) {

  const authToken = req.get('Authorization') || '';
  let basicToken;

  if (!authToken.toLowerCase().startsWith('basic')) {
    return res.status(401).json({ error: 'Missing Basic token'});
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length);
  }

  const [tokenUserName, tokenPassword] = Buffer
    .from(basicToken, 'base64')
    .toString()
    .split(':');

  if(!tokenUserName || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request'});
  }

  req.app.get('db')('thingful_users')
    .where({ user_name: tokenUserName})
    .first()
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized request'});
      }
      req.user = user;
      console.log(user);
      next();
    })
    .catch(next);

}

module.exports = authenticateToken;