import cors from "cors";
import { config as envConfig } from "dotenv";
import express from "express";
import http from "http";
import { Server as Socket } from "socket.io";
import posts from "./posts.js";
import todos from "./todos.js";
import users from "./users.js";

// Carrega as configurações secretas do '.env'.
envConfig();

// Inicia a instância da aplicação Express.
const app = new express();

// Permite requisições CORS iniciadas pela origem http://localhost:3000.
const corsOptions = { origin: "http://localhost:3000" };
app.use(cors(corsOptions));

// Inicia a instância do servidor HTTP.
const server = http.Server(app);

// Inicia instância do servidor Socket.io (para realtime).
const socket = new Socket(server, { cors: corsOptions });

// Auto-converte requisições 'application/x-www-form-urlencoded' em objetos dentro de 'req.body'.
app.use(express.urlencoded({ extended: true }));

// Auto-converte Strings JSON em objetos dentro de 'req.body'.
app.use(express.json());

// Mapeia as operações na entidade 'posts' com as rotas desejadas no servidor Express.
posts(app);

// Mapeia as operações na entidade 'todos' com as rotas desejadas no servidor Express.
todos(app, socket);

// Mapeia as operações na entidade 'users' com as rotas desejadas no servidor Express.
users(app);

// Inicia servidor na porta 8080.
server.listen(8080, () => console.log("Listening at http://localhost:8080"));
