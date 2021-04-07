import jwt from "jsonwebtoken";
import { employeeRoles } from '../../constants';

const isAdminMiddleWare = (req, res, next) => {
  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["token"];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware


    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    req.user = decoded.user;
    res.url = req.url;

    // console.log(decoded);
    if (decoded.user.role === employeeRoles.ADMIN)
      next();
    else res.status(401).send("Only admin can access this api.");
  } catch (ex) {
    //if invalid token
    res.status(401).send("Invalid token.");
  }
};
export default isAdminMiddleWare;