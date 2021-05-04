import nedb from "nedb-promises";

export default function configure(server) {
  const todos = nedb.create({ filename: "todos.db", autoload: true });

  const getAll = async (_req, res) => {
    const result = await todos.find();
    res.status(200).send(result);
  };

  const getById = async (req, res) => {
    const query = { _id: req.params.id };
    const result = await todos.findOne(query);
    res.status(200).send(result);
  };

  const create = async (req, res) => {
    const payload = { text: req.body.text, createdAt: new Date() };
    const result = await todos.insert(payload);
    res.status(201).send(result);
  };

  const update = async (req, res) => {
    const body = req.body;
    if (body.text === undefined && body.done === undefined) {
      res.status(204).send();
    }
    const query = { _id: req.params.id };
    const payload = { updatedAt: new Date() };
    if (body.text !== undefined) payload.text = body.text;
    if (body.done !== undefined) payload.done = body.done;
    const result = await todos.update(
      query,
      { $set: payload },
      { returnUpdatedDocs: true }
    );
    res.status(200).send(result);
  };

  const remove = async (req, res) => {
    const query = { _id: req.params.id };
    await todos.remove(query);
    res.status(204).send();
  };

  server.get("/todos", getAll);
  server.get("/todos/:id", getById);
  server.post("/todos", create);
  server.put("/todos/:id", update);
  server.delete("/todos/:id", remove);
};
