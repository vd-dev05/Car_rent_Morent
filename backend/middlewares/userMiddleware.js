import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import CarModel from "../models/CarModel.js";
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

const UserMiddleware = {
  validateRegister: async (req, res, next) => {
    try {
      const { username, email, password, confirmPassword } = req.body;
      if (!email) throw new Error("Email không được bỏ trống!");
      if (email) {
        const formatEmail = String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        if (!formatEmail) throw new Error("Email không đúng định dạng!");
      }
      if (!username) throw new Error("Username không được bỏ trống!");
      if (!password) throw new Error("Mật khẩu không được bỏ trống!");
      if (password.length < 6)
        throw new Error("Mật khẩu không được dưới 6 kí tự!");
      if (!confirmPassword)
        throw new Error("Mật khẩu xác nhận không được bỏ trống!");
      next();
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  validateLogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email) throw new Error("Email không được bỏ trống!");
      if (email) {
        const formatEmail = String(email)
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          );
        if (!formatEmail) throw new Error("Email không đúng định dạng!");
      }
      if (!password) throw new Error("Mật khẩu không được bỏ trống!");
      next();
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
  //Api check xem có phải provider không (qua token)
  checkRoleProvider: async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided");
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      // console.log(decoded);
      const role = decoded.role;
      if (role !== "PROVIDER") throw new Error("Bạn chưa phải nhà cung cấp");
      req.user = {
        idUser: decoded._id,
      }; //truyền id của người dùng (có api sẽ cần)

      next();
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },

  modifyUser: async (req, res, next) => {
    const accessToken = req.headers.authorization.split(" ")[1];
    // console.log(accessToken);
    if (!accessToken) {
      res.status(400).send({
        message: "Permisson denined!",
        data: null,
      });
    } else {
      const decoded = jwt.verify(accessToken, SECRET_KEY);
      console.log(decoded.role);

      req.user = {
        _id: decoded._id,
        role: decoded.role,
      };
      next();
    }
  }, //middleware check token

  ////////
  checkProviderOrAdmin: async (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) throw new Error("No token provided or admin");
    try {
      const decoded = jwt.verify(token, SECRET_KEY);

      const role = decoded.role;

      if (role === "ADMIN" || role === "PROVIDER")
        req.user = {
          idUser: decoded._id,
        }; //truyền id của người dùng (có api sẽ cần)
      console.log(req);
      next();
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  },
};

export default UserMiddleware;
