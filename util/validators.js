module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmedPassword,
  image
) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (email.trim() === "") {
    errors.email = "Email must not be empty";
  } else {
    const regEx = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email.match(regEx)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (confirmedPassword === "") {
    errors.confirmedPassword = "Confirmed Password must not be empty";
  }
  if (password === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmedPassword) {
    errors.confirmedPassword = "Password must match";
  }
  if (image === "") {
    errors.image = "you must add your photo";
  } else if (!image.endsWith(".png") && !image.endsWith(".jpg")) {
    errors.image = "Image must be of type png or jpg";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
