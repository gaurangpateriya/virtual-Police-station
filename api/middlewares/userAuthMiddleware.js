import jwt from 'jsonwebtoken';
import moment from 'moment';
import UserService from '../server/services/UserService';

const authMiddleWare = async (req, res, next) => {
  // get the token from the header if present
  const token = req.headers['x-access-token'] || req.headers.token;
  // if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    // if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = await UserService.getAUser('id', decoded.user.id);
    // const { user } = req;
    // const { isaVerified, isaStartDate } = user;
    res.url = req.url;
    res.user = req.user;
    // // checking the account is ISA verified or not
    // if (!isaVerified && isaStartDate && moment(isaStartDate).add(8, 'days').isBefore(moment())) {
    //   return res.status(401).send('Your account is not verified.');
    // }
    // console.log(req.user);
    // changig the lastst activity of the user on every post request

    next();
  } catch (ex) {
    // if invalid token

    res.status(401).send('Invalid token.');
  }
};
export default authMiddleWare;
