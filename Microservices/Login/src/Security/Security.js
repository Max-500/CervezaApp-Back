import jwt from "jsonwebtoken";

const secretKey = "xk^Tt7z$BcY@v2Qf8g#p";

// Define las opciones del token, incluyendo su tiempo de expiración (en este caso, 1 hora)
const options = {
  algorithm: "HS256",
  expiresIn: "1h",
};

function verifyToken(req, res, next) {
  console.log("Entro a verify token");
  const authHeader = req.headers.authorization; // El token JWT se encuentra en el encabezado Authorization
  if (authHeader !== undefined) {
    const token = authHeader.split(" ")[1];
    console.log(token);
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("Para verificar si caigo aqui");
      return res
        .status(401)
        .json({ mensaje: "Se requiere un token de autenticación" });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res
          .status(200)
          .json({ mensaje: "El token de autenticación no es válido" });
      } else {
        next();
      }
    });
  } else {
    return res
        .status(401)
        .json({ mensaje: "Se requiere un token de autenticación" });
  }
}

async function generateToken(userInfo, secretKey, options) {
  let token = await jwt.sign(userInfo, secretKey, options);
  console.log(token);
  return token;
}

export { generateToken, secretKey, options, verifyToken };
