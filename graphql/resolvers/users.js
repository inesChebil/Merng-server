const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");
const { UserInputError } = require("apollo-server");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      image: user.image,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}
module.exports = {
  Mutation: {
    async login(_, { username, password }) {
      const { errors, valid } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      const user = await User.findOne({ username });

      if (!user) {
        errors.general = "User Not Found";
        throw new UserInputError("User Not Found", { errors });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          errors.general = "Wrong Credentials";
          throw new UserInputError("Wrong Credentials", { errors });
        }
      }
      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    //  most of the time we will use args, but parent
    // register(parent, args, context, info)
    async register(
      _,
      { registerInput: { username, email, password, confirmedPassword, image } } //   context, //   info
    ) {
      //  validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmedPassword,
        image
      );

      if (!valid) {
        throw new UserInputError("Errors", {
          errors,
        });
      }
      // TODO:  Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("username is taken", {
          errors: {
            username: "this username is taken",
          },
        });
      }
      // TODO:  hash password before store it in the DB and create an auth token (we need to install bcryptjs and jsonwebtoken)
      //   toIsoString is used to convert the date to a string
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
        image,
      });

      const res = await newUser.save();
      const token = generateToken(res);
      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
