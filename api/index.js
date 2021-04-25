import config from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import moment from 'moment';
import morgan from 'morgan';
import path from 'path';

import AuthenticationRoutes from './server/routes/AuthenticationRoutes';
import EmployeeRoutes from './server/routes/EmployeeRoutes';
import UserRoutes from './server/routes/UserRoutes';
import AdminRoutes from './server/routes/AdminRoutes';
import StationController from './server/controllers/StationController';

// import mailjet from 'node-mailjet';
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SMS_API_KEY);

// const cron = require('node-cron');

config.config();

// running the cron jobs
const app = express();
const port = process.env.PORT || 8000;



app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.use(cors());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));


app.use('/api/auth', AuthenticationRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/employee', EmployeeRoutes);
app.use('/api/user', UserRoutes)

app.use('/api/assets/clearence-documents', express.static(path.join(__dirname, '../assets/clearence-documents')))
app.get('/api/station/get', StationController.getAllStation);

// when a random route is inputed
app.get('*', (req, res) => res.status(200).send({
    message: 'You are looking at the Virtual police station apis',
}));

app.listen(port, () => {
    console.log(`Server is running on PORT ${port}: time : ${moment().tz('Asia/Kolkata').format('Do MMM YYYY - hh:mm:ss a')}`);
});
export default app;
