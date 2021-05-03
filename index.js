import cors from "cors";
import express from "express";
import posts from "./posts.js";
import todos from "./todos.js";
import users from "./users.js";

// Inicia a instância do servidor Express.
const server = new express();

// Bloqueia requisições CORS não iniciadas pela origem http://localhost:3000.
server.use(
  cors({
    origin(origin, next) {
      if (origin !== "http://localhost:3000")
        return next(new Error("Unauthorized origin."), false);
      return next(null, true);
    },
  })
);

// Auto-converte requisições 'application/x-www-form-urlencoded' em objetos dentro de 'req.body'.
server.use(express.urlencoded({ extended: true }));

// Auto-converte Strings JSON em objetos dentro de 'req.body'.
server.use(express.json());

// Mapeia as operações na entidade 'posts' com as rotas desejadas no servidor Express.
server.get("/posts", posts.getAll);
server.get("/posts/:id", posts.getById);
server.post("/posts", posts.create);
server.put("/posts/:id", posts.update);
server.delete("/posts/:id", posts.remove);

// Mapeia as operações na entidade 'todos' com as rotas desejadas no servidor Express.
server.get("/todos", todos.getAll);
server.get("/todos/:id", todos.getById);
server.post("/todos", todos.create);
server.put("/todos/:id", todos.update);
server.delete("/todos/:id", todos.remove);

// Mapeia as operações na entidade 'users' com as rotas desejadas no servidor Express.
server.get("/users/:email", users.exists);
server.post("/users/register", users.register);
server.post("/users/login", users.login);

server.listen(8080, () => console.log("Listening at http://localhost:8080"));
