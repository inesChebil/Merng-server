const { AuthenticationError } = require("apollo-server");

// jwt will help as decode the token that we got
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
module.exports = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    // if we have the authHeader we need to get the token from it
    //   a convention when working with authorisation with tokens, we send this header of the value of "Bearer token"
    const token = authHeader.split("Bearer ")[1];

    if (token) {
      try {
        // we need the verify the token  and make sure that we issued this token and it still valid
        const user = jwt.verify(token, SECRET_KEY);
        return user;
      } catch (err) {
        throw new AuthenticationError("Invalid/Expired Token");
      }
    }
    throw new Error("Authentification token must be 'Bearer [token]");
  }
  throw new Error("Authorization header must be provided");
};
