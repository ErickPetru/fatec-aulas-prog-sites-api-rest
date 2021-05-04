import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nedb from "nedb-promises";
import auth from "./auth.js";

export default function configure(server) {
  const users = nedb.create({ filename: "users.db", autoload: true });

  const getCurrent = async (req, res) => {
    const query = { _id: req.userId };
    const { password, ...result } = await users.findOne(query);
    res.status(200).send(result);
  };

  const exists = async (req, res) => {
    const query = { email: req.params.email };
    const result = await users.findOne(query);
    if (result) res.status(200).send(true);
    else res.status(200).send(false);
  };

  const register = async (req, res) => {
    const hash = await bcrypt.hash(req.body.password, 10);
    const payload = {
      email: req.body.email,
      password: hash,
      createdAt: new Date(),
    };
    const { password, ...result } = await users.insert(payload);
    res.status(201).send(result);
  };

  const login = async (req, res) => {
    const query = { email: req.body.email };
    const result = await users.findOne(query);
    if (result && (await bcrypt.compare(req.body.password, result.password))) {
      const secret = process.env.JWT_SECRET;
      const token = jwt.sign({ id: result._id }, secret, { expiresIn: "1h" });
      res.status(200).send({ token });
    } else {
      res.status(401).send();
    }
  };

  server.get("/users/current", auth, getCurrent);
  server.get("/users/exists/:email", exists);
  server.post("/users/register", register);
  server.post("/users/login", login);
}
