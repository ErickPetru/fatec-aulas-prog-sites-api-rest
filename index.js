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

// Mapeia as operações na entidade 'posts' com as rotas desejadas no servidor Express.
posts(server);

// Mapeia as operações na entidade 'todos' com as rotas desejadas no servidor Express.
todos(server);

// Mapeia as operações na entidade 'users' com as rotas desejadas no servidor Express.
users(server);

server.listen(8080, () => console.log("Listening at http://localhost:8080"));
