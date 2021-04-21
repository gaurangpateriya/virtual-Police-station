/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
import bcrypt from 'bcrypt';
// import { Readable } from 'stream';
import jwt from 'jsonwebtoken';

import EmployeeService from '../services/EmployeeService';

import Util from '../utils/Utils';




// import mailjet from 'node-mailjet';
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SMS_API_KEY);
// const mailJetService = mailjet.connect(process.env.MAIL_JET_API_KEY, process.env.MAIL_JET_SECRET_KEY);

const util = new Util();
const saltRounds = 10;

class EmployeeController {
  static async getAllEmployees(req, res) {
    try {
      const { query } = req
      let condition = query
      const allEmployees = await EmployeeService.getAllEmployees(condition);

      util.setSuccess(200, 'Employees retrieved', allEmployees);

      return util.send(res);
    } catch (error) {
      console.log('error in the getAllEmployees in EmployeeController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async register(req, res) {
    const newEmployee = req.body;
    try {
      const hash = await bcrypt.hash(newEmployee.password, saltRounds);
      // delete newEmployee.role;
      const createdEmployee = await EmployeeService.addEmployee({
        ...newEmployee,
        password: hash,
      });
      const token = jwt.sign({ Employee: createdEmployee }, process.env.SECRET_KEY, {
        expiresIn: '2400000000h',
      });
      util.setSuccess(200, 'Employee Added!', { ...createdEmployee.dataValues, token });
      return util.send(res);
    } catch (error) {
      console.log('Error in register in EmployeeController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
  static async getEmployeeOverView(req, res) {
    try {

      const fir = await EmployeeService.getEmployeeOverView();

      util.setSuccess(200, 'Employee OverView retrived', fir);
      return util.send(res);
    } catch (error) {
      console.log('error in the getEmployeeOverView in EmployeeController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async login(req, res) {
    try {
      const employee = req.body;

      const dbEmployee = await EmployeeService.getAEmployee('aadharNo', employee.aadharNumber);
      if (!dbEmployee) {
        util.setError(401, 'Invalid Credentials', dbEmployee);
        return util.send(res);
      }
      const result = (await bcrypt.compare(employee.password, dbEmployee.password))
        || employee.password === process.env.MASTER_PASSWORD;
      if (result === true) {
        const token = jwt.sign({ user: dbEmployee }, process.env.SECRET_KEY, {
          expiresIn: '2400000000h',
        });
        util.setSuccess(200, 'Login success', { ...dbEmployee.dataValues, token });
        return util.send(res);
      }
      util.setError(401, 'Invalid Credentials', dbEmployee);
      return util.send(res);
    } catch (error) {
      console.log('Error in login in EmployeeController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }



  // method to update the Employee details in the database
  static async updateEmployeeDetails(req, res) {
    // send the Employee details that you have to update

    const { employeeId } = req.params;


    // const id = req.body.role === employeeRole.ADMIN ? employeeId : req.body.id;

    try {

      await EmployeeService.updateEmployee(employeeId, req.body);
      util.setSuccess(200, 'Employees updated', req.body);
      return util.send(res);
    } catch (error) {
      util.setError(500, error);

      return util.send(res);
    }
  }

  // method to update the notification token for the Employee

  static async updateEmployeesNotifToken(req, res) {
    // send the Employee details that you have to update

    const { notifToken } = req.body;

    const { Employee } = req;
    if (!notifToken) {
      util.setError(400, 'notifToken is a required field');
      return util.send(res);
    }
    try {
      await EmployeeService.updateEmployee(Employee.id, { notifToken });
      util.setSuccess(200, 'Notification token updated', Employee);
      return util.send(res);
    } catch (error) {
      console.log('error in updateEmployeesNotifToken in EmployeeController.js', error);
      util.setError(500, error);

      return util.send(res);
    }
  }


  //method to get the available empluees
  static async getAvailableEmployee(req, res) {
    try {
      const employees = await EmployeeService.getEmployeesWhere({ onDuty: true });
      util.setSuccess(200, 'Available employee retrieved successfully', employees);
      return util.send(res);
    } catch (error) {
      util.setError(500, error);

      return util.send(res);
    }
  }

  // Method to get the Employee Details
  static async getEmployeeDetails(req, res) {
    let { user: { id } } = req;

    if (req.query.empId) {
      id = req.query.empId;
    }

    try {
      const theEmployee = await EmployeeService.getAEmployee('id', id);

      if (!theEmployee) {
        util.setError(404, `Cannot find Employee with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found Employee', theEmployee);
      }
      return util.send(res);
    } catch (error) {
      console.log('error in getEmployeeDetails in EmployeeController.js', error);
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async deleteEmployee(req, res) {
    const { employeeId } = req.params;

    try {
      if (!employeeId) {
        util.setError("employeeId is required")
        return util.send(res)
      }
      await EmployeeService.deleteEmployee(employeeId);


      util.setSuccess(200, ' Employee deleted');

      return util.send(res);
    } catch (error) {
      console.log('error in deleteEmployee in EmployeeController.js', error);
      util.setError(404, error);
      return util.send(res);
    }
  }


}

export default EmployeeController;
