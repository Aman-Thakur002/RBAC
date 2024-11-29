const { Users } = require("../models");

import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET;



export function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

// Function to Create Token
export function createAccesstoken(user) {
  const EXPIRE_IN = Math.floor(new Date().getTime() / 1000) + 24 * 24 * 60 * 60;
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: user.type,
      role: user.role,
      expiresIn: EXPIRE_IN,
    },
    SECRET_KEY
  );  

  const updateObj = {
    accessToken: token,
    lastLogin: new Date()
  };
 
  Users.update(updateObj, { where: { id: user.id } });
  return token;
 }

export function decodeToken(token) {
  return jwt.verify(token, SECRET_KEY);
}
