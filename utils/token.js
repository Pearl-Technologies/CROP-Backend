const jwt = require("jsonwebtoken");

module.exports.generateToken = (userInfo) => {
  const payload = {
    _id: userInfo._id,
    name: userInfo.name,
    email: userInfo.email,
    role: userInfo.role,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "7days",
  });

  return token;
};

// tokenForVerify
module.exports.tokenForVerify = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    },
    process.env.JWT_SECRET_FOR_VERIFY,
    { expiresIn: '15m' }
  );
};