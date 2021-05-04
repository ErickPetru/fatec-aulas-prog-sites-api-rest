import nedb from "nedb-promises";

export default function configure(app, socket) {
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
    const payload = { text: req.body.text, done: false, createdAt: new Date() };
    const result = await todos.insert(payload);
    socket.emit("todo-created", result);
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
    socket.emit("todo-updated", result);
    res.status(200).send(result);
  };

  const remove = async (req, res) => {
    const query = { _id: req.params.id };
    await todos.remove(query);
    socket.emit("todo-removed", query);
    res.status(204).send();
  };

  app.get("/todos", getAll);
  app.get("/todos/:id", getById);
  app.post("/todos", create);
  app.put("/todos/:id", update);
  app.delete("/todos/:id", remove);
}
