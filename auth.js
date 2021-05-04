import jwt from "jsonwebtoken";

// Função de apoio para verificação de token JWT, para reuso quando necessário.
export default function auth(req, res, next) {
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
