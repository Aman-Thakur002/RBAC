const { Users } = require("../models");
const { Op } = require("sequelize");
const sgMail = require('@sendgrid/mail')
import { comparePassword } from "../utility/password-hash.js";
import { createAccesstoken } from "../utility/jwt.js";
import crypto from "crypto";

sgMail.setApiKey(process.env.OTP_API_KEY)

//------------------------------------------login controller-----------------------------------------

export async function logInAdmin(req, res, next) {
  const params = req.body;

  let email = params.email.trim().toLowerCase();
  let password = params.password.trim();
  try {
    let userStored = await Users.findOne({
      where: {
        email: email,
      },
    });
    if (!userStored) {
      return res
        .status(404)
        .send({ status: "error", message: res.__("noUser") });
    }

    let isMatch = await comparePassword(password, userStored.password);
    if (!isMatch) {
      return res.status(400).send({
        status: "error",
        message: res.__("users.wrongPassword"),
      });
    }

    if (!userStored.verified) {
      // Generate OTP
      const otp = crypto.randomInt(100000, 1000000).toString();
      await Users.update({otp : otp }, {
        where : {
          email : email
        }
      })
      const newData = {
        email: userStored.email,
        name: userStored.name,
        otp: otp,
      };
      SendOtp(newData);

      return res.status(401).send({
        status: "error",
        statusType: "notVerified",
        message: res.__("users.mailNotVerified"),
      });
    }

    // User is verified and password matches
    return res.status(200).send({
      status: "success",
      message: res.__("users.login"),
      accessToken: createAccesstoken(userStored),
      users: {
        id: userStored.id,
        name: userStored.name,
        email: userStored.email,
        phoneNumber: userStored.phoneNumber,
        role: userStored.role,
        type: userStored.type,
      },
    });
  } catch (error) {
    next(error);
  }
}

//------------------------------verify otp----------------------------------------
export async function verifyOtp(req, res, next) {
  const params = req.body;

  const email = params.email.trim().toLowerCase();
  const otp = params.otp.trim();

  try {
    let userStored = await Users.findOne({
      where: {
        email: email,
      },
    });

    if (!userStored) {
      return res
        .status(200)
        .send({ status: "error", message: res.__("noUser") });
    }

    if (userStored.otp != otp) {
      res.status(200).send({
        status: "error",
        message: res.__("users.otpNotMatch"),
      });
    } else {
      Users.update(
        {
          verified: true,
        },
        { where: { id: userStored.id } }
      );

      res.status(200).send({
        status: "success",
        message: res.__("users.verify"),
        accessToken: createAccesstoken(userStored),
        user: {
          id: userStored.id,
          name: userStored.name,
          email: userStored.email,
          phoneNumber: userStored.phoneNumber,
          role: userStored.role,
        },
      });
    }
  } catch (error) {
    next(error);
  }
}

//---------------------------------------create user--------------------------------------------
export async function createUser(req, res, next) {
  try {
  
    if (!req.body.type) {
      req.body.type = "User";
    }
    req.body.createdBy = req.user.id;
    let newUser = await Users.create(req.body);

    delete newUser.password;
    res.status(200).send({
      status: "success",
      message: res.__("users.userCreate"),
      data: newUser,
    });
  } catch (error) {
    next(error);
  }
}
//------------------------delete users----------------------------------------
export async function deleteUser(req, res, next) {
  try {
    if (!req.permission.global) req.params.id = req.user.id;
    let data = await Users.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (data) {
      res.status(200).send({
        status: "success",
        message: res.__("users.deleteUser"),
        data: data,
      });
    } else {
      res.status(200).send({
        status: "error",
        message: res.__("serverError"),
        data: data,
      });
    }
  } catch (error) {
    next(error);
  }
}

//---------------------------get all users-----------------------------------------
export async function getUsers(req, res, next) {
  let query = {};

  try {
    let limit = req?.query?.limit ? Number(req.query.limit) : 10;
    if (req.query?.page) {
      query["limit"] = limit;
      query["offset"] = (Number(req.query.page) - 1) * limit;
    }

    let order = req.query?.order ? req.query?.order : "desc";

    console.log(req.query);
    if (req.query?.orderBy) {
      query["order"] = [[req.query?.orderBy, order]];
    } else {
      query["order"] = [["id", order]];
    }

    if (req.query?.search) {
      query["where"][Op.or] = [
        { name: { [Op.like]: "%" + req.query?.search + "%" } },
        { email: { [Op.like]: "%" + req.query?.search + "%" } },
        { phoneNumber: { [Op.like]: "%" + req.query?.search + "%" } },
      ];
    }


    //// Select attributes
    query["attributes"] = [
      "id",
      "name",
      "email",
      "type",
      "role",
      "phoneNumber",
      "status",
    ];

    let data = await Users.findAndCountAll(query);

    res.status(200).send({
      status: "success",
      total: data.count,
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
}

//-----------------------------------------send email function-----------------------------------------------
const SendOtp = async (data) => {
  const msg = {
    to: data.email, // recipient's email
    from: 'aman@spirehubs.com', // your verified sender email
    subject: 'Verify Your Account',
    text: `Hi ${data.name} ,\n\nYour OTP is: ${data.otp}\n\nPlease use this OTP to verify your email.\n\nThank you!`,
    html: `
    <div style="font-family: Arial, sans-serif; color: #333; background-color: #f5f5f5; padding: 20px; max-width: 600px; margin: auto; border-radius: 10px;">
      <div style="text-align: center; background-color: #fff; padding: 20px; border-radius: 10px;">
        <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">Verify Your Account</h2>
        <p style="color: #555; font-size: 16px;">Hi <strong style="color: #2c3e50;">${data.name} 🙋‍♂️</strong>,</p>
        <p style="color: #555; font-size: 16px;">Your OTP is:</p>
        <h3 style="color: #3c763d; font-size: 30px; font-weight: bold; padding: 10px; background-color: #e8f5e9; display: inline-block; border-radius: 5px;">${data.otp}</h3>
        <p style="color: #555; font-size: 16px; margin-top: 20px;">Please use this OTP to verify your email.</p>
        <hr style="border: 1px solid #ddd; margin: 30px 0;">
      </div>
    </div>
  `,
  };

  try {
    await sgMail.send(msg);
    console.log('OTP sent via SendGrid');
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
}