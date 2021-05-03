import bcrypt from "bcrypt";
import nedb from "nedb-promises";

const users = nedb.create({ filename: "users.db", autoload: true });

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
  const result = await users.insert(payload);
  res.status(201).send({
    _id: result._id,
    email: result.email,
    createdAt: result.createdAt,
  });
};

const login = async (req, res) => {
  const query = { email: req.body.email };
  const result = await users.findOne(query);
  if (result && (await bcrypt.compare(req.body.password, result.password))) {
    res.status(200).send({
      _id: result._id,
      email: result.email,
      createdAt: result.createdAt,
    });
  } else {
    res.status(401).send();
  }
};

export default {
  exists,
  register,
  login,
};
