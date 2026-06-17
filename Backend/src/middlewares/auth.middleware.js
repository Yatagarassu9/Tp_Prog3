import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    // Busca el header "Authorization" en la petición
    const authHeader = req.headers.authorization;

    // Si no hay token, rechaza con 401 (no autorizado)
    if (!authHeader) {
      return res.status(401).json({
        error: "Token required",
      });
    }

    // El header viene así: "Bearer eyJhbGci..."
    // El split separa por espacio y agarra solo el token
    // split(" ") corta el string cada vez que encuentra un espacio y devuelve un array
    // como quiero solo el token y no el "Bearer", agarra el índice [1]
    const token = authHeader.split(" ")[1];

    // Verifica que el token sea válido con tu JWT_SECRET
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda los datos del usuario en req.user para usarlos después en el roleMiddleware
    req.user = decoded;

    // Si todo está bien, sigue al siguiente middleware o ruta
    next();

  } catch (error) {
    res.status(401).json({
      error: "Invalid token",
    });
  }
};
