import cors from "cors";
import { config as envConfig } from "dotenv";
import express from "express";
import jwt from "jsonwebtoken";
import posts from "./posts.js";
import todos from "./todos.js";
import users from "./users.js";

// Carrega as configurações secretas do '.env'.
envConfig();

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

// Função de apoio para verificação de token JWT, para reuso quando necessário.
function verifyJWT(req, res, next) {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json("No token provided.");
  }

  const secret = process.env.JWT_SECRET;
  jwt.verify(token.split(" ")[1], secret, (error, decoded) => {
    if (error) return res.status(401).json("Token verification failed.");
    req.userId = decoded.id;
    next();
  });
}

// Mapeia as operações na entidade 'posts' com as rotas desejadas no servidor Express.
server.get("/posts", posts.getAll);
server.get("/posts/:id", posts.getById);
server.post("/posts", verifyJWT, posts.create);
server.put("/posts/:id", verifyJWT, posts.update);
server.delete("/posts/:id", verifyJWT, posts.remove);

// Mapeia as operações na entidade 'todos' com as rotas desejadas no servidor Express.
server.get("/todos", todos.getAll);
server.get("/todos/:id", todos.getById);
server.post("/todos", todos.create);
server.put("/todos/:id", todos.update);
server.delete("/todos/:id", todos.remove);

// Mapeia as operações na entidade 'users' com as rotas desejadas no servidor Express.
server.get("/users/current", verifyJWT, users.getCurrent);
server.get("/users/exists/:email", users.exists);
server.post("/users/register", users.register);
server.post("/users/login", users.login);

server.listen(8080, () => console.log("Listening at http://localhost:8080"));
