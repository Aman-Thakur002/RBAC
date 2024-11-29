import { decodeToken } from "../utility/jwt";
const { Users} = require("../models");

export const ensureAuth = (...userType) => {
  return function (req, res, next) {
    if (!req.headers.authorization && userType.includes("Guest")) {
      return next();
    }
    if (!req.headers.authorization) {
      return res.status(403).send({
        status: "error",
        message: res.__("auth.notAuthrize"),
      });
    }
    // Remove Bearer from string
    const token = req.headers.authorization.replace(/^Bearer\s+/, "");
    try {
      var payload = decodeToken(token);
      if (payload.expiresIn < Math.floor(new Date().getTime() / 1000)) {
        return res
          .status(401)
          .send({ status: "error", message: res.__("auth.tokenExp") });
      }
    } catch (ex) {
      return res
        .status(401)
        .send({ status: "error", message: res.__("auth.tokenInvalid") });
    }

    Users.findOne({
      where: {
        id: payload.id,
        verified : true
      },
    })
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .send({ status: "error", message: res.__("auth.userInvalid") });
        }
        
        req.permission = {};
        if (
          user.type === "Admin" ||
          userType.includes(user.type) ||
          userType.includes("Guest")
        ) {
          req.user = payload;
          req.user.hasAccess = (permissionID) => {
            if (
              user?.Role?.accessIDs.split(",").includes(permissionID) ||
              user?.type === "Admin"
            )
              return true;
            return false;
          };
          req.permission.global = user.type === "Admin" ? true : false;

          if (
            user?.Role?.accessIDs
              ?.split(",")
              ?.includes(req.module + "-global") &&
            user.type !== "Admin"
          ) {
            req.permission.global = true;
          }
          return next();
        }

        if (!user.Role?.accessIDs.split(",").includes(req.permission.module)) {
          return res
            .status(403)
            .send({ status: "error", message: res.__("denied") });
        }

        if (user.Role.accessIDs.split(",").includes(req.module + "-global")) {
          req.permission.global = true;
        } else {
          req.permission.global = false;
        }
        req.user = payload;
        req.user.hasAccess = (permissionID) => {
          if (
            user?.Role?.accessIDs.split(",").includes(permissionID) ||
            user?.type === "Admin"
          )
            return true;
          return false;
        };
        return next();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          status: "error",
          message: res.__("auth.serverError"),
          result: err,
        });
      });
  };
};


export const setModule = (module) => {
  return function (req, res, next) {
    req.module = module;

    switch (req.method) {
      case "GET":
        req.permission = { module: module + "-read" };
        break;

      case "POST":
        req.permission = { module: module + "-write" };
        break;

      case "PUT":
        req.permission = { module: module + "-write" };
        break;

      case "PATCH":
        req.permission = { module: module + "-all" };
        break;

      case "DELETE":
        req.permission = { module: module + "-all" };
        break;
      default:
        break;
    }
    next();
  };
};
