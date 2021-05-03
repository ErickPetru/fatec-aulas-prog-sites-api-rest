import nedb from "nedb-promises";

const posts = nedb.create({ filename: "posts.db", autoload: true });

const getAll = async (_req, res) => {
  const result = await posts.find();
  res.status(200).send(result);
};

const getById = async (req, res) => {
  const query = { _id: req.params.id };
  const result = await posts.findOne(query);
  res.status(200).send(result);
};

const create = async (req, res) => {
  const payload = {
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    author: req.body.author,
    createdAt: new Date(),
  };
  const result = await posts.insert(payload);
  res.status(201).send(result);
};

const update = async (req, res) => {
  const body = req.body;
  if (
    body.title === undefined &&
    body.description === undefined &&
    body.content === undefined &&
    body.author === undefined
  ) {
    res.status(204).send();
  }
  const query = { _id: req.params.id };
  const payload = { updatedAt: new Date() };
  if (body.title !== undefined) payload.title = body.title;
  if (body.description !== undefined) payload.description = body.description;
  if (body.content !== undefined) payload.content = body.content;
  if (body.author !== undefined) payload.author = body.author;
  const result = await posts.update(
    query,
    { $set: payload },
    { returnUpdatedDocs: true }
  );
  res.status(200).send(result);
};

const remove = async (req, res) => {
  const query = { _id: req.params.id };
  await posts.remove(query);
  res.status(204).send();
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
