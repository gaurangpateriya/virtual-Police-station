/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */


import SosService from '../services/SosService';

import Util from '../utils/Utils';

import { employeeRoles, emplyoeeSosResponse, SosRole, sosStatus, SosStatus } from '../../../constants';
import EmployeeService from '../services/EmployeeService';
import { sequelize } from '../src/models';
import { Op } from 'sequelize';
import NotificationController from './NotificationController';
import twilio from 'twilio';

Math.radians = function (degrees) {
  return degrees * Math.PI / 180;
}


const util = new Util();

const distanceBetweenLatLong = (latLong1, latLong2) => {
  const lon1 = Math.radians(latLong1.longitude)
  const lon2 = Math.radians(latLong2.longitude)
  const lat1 = Math.radians(latLong1.latitude)
  const lat2 = Math.radians(latLong2.latitude)


  const dlon = lon2 - lon1
  const dlat = lat2 - lat1
  const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2

  const c = 2 * Math.asin(Math.sqrt(a))
  const r = 6371


  return (c * r)
}

const accountSid = process.env.TWILLIO_ACCOUNT_SID;
const authToken = process.env.TWILLIO_AUTH_TOKEN;

const twilioClient = twilio(accountSid, authToken);





class SosController {
  static async getAllSos(req, res) {
    try {
      const { user, query } = req
      let condition = query

      if (user.role !== employeeRoles.ADMIN) {
        if (user.role) {
          condition = { EmployeeId: user.id, ...condition }
        } else {

          condition = { UserId: user.id, ...condition }
        }
      }
      const allSoss = await SosService.getAllSos(condition);
      util.setSuccess(200, 'Soss retrieved', allSoss);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllSoss in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getASos(req, res) {
    try {
      const { sosId } = req.query


      if (!sosId) {
        util.setError(400, "sosId is required")
        return util.send(res);
      }
      const sos = await SosService.getASos({ id: sosId });
      util.setSuccess(200, 'Sos retrieved', sos);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllSoss in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
  static async updateSos(req, res) {
    try {
      const { id } = req.body
      const allSoss = await SosService.updateSos(id, req.body);
      util.setSuccess(200, 'Soss updated', allSoss);
      return util.send(res);
    } catch (error) {
      console.log('error in the updateSos in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getSosOverView(req, res) {
    try {

      const overView = await SosService.getOverview();
      util.setSuccess(200, 'Soss updated', overView);
      return util.send(res);
    } catch (error) {
      console.log('error in the updateSos in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
  static async addSosSignal(req, res) {

    try {
      const { user } = req;
      const { id, name } = user;
      const { currentLocation, startLocation } = req.body;
      const status = sosStatus.ACTIVE;
      // UserId: DataTypes.INTEGER,
      // EmployeeId: DataTypes.INTEGER,

      // currentLocation: DataTypes.STRING,
      // startLocation: DataTypes.STRING,
      // endLocation: DataTypes.STRING,
      // status: DataTypes.STRING,

      const availableEmployees = await EmployeeService.getEmployeesWhere({ onDuty: true });
      if (availableEmployees.length === 0) {
        util.setError(404, "No Employees are present at this points");
        return util.send(res);
      }
      // const sosSignals = [];
      // //creating a sos signal for all employees
      // for (let i = 0; i < availableEmployees.length; i += 1) {
      //   const e = availableEmployees[i];
      //   const signal = { UserId: id, EmployeeId: e.dataValues.id, currentLocation, startLocation, status };
      //   await SosService.addSos(signal);
      //   sosSignals.push(signal);
      // }
      const { id: employeeId, notifToken, mobileNo } = availableEmployees[0].dataValues

      //sending the signal to the first available employee
      let signal = { UserId: id, EmployeeId: employeeId, currentLocation, startLocation, status };
      signal = await SosService.addSos(signal);

      twilioClient.calls
        .create({
          twiml: '<Response><Say>Some one is in danger. please checkout the Police App to help him or her.</Say></Response>',
          to: `+91${mobileNo}`,
          from: '+17084773480'
        })
        .then(call => console.log(call.sid)).catch(err => {
          console.log(err, err.response)
        })

      // sending the notification and call to all the employees in whicch are haiving the SOS Signal
      NotificationController.sendNotification(
        [notifToken],
        'Someone is in danger',
        `${name} has raised a SOS request.\n Click here to help him.`,
        {
          screen: 'Map',
          sos: { ...signal.dataValues, User: user }
        }
      )


      util.setSuccess(200, 'Sos signal added', signal);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllSoss in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getActiveSos(req, res) {
    try {
      const { user } = req;
      const { id } = user;

      const activeSos = await SosService.getASos({ UserId: id, status: sosStatus.ACTIVE, employeeResponse: { [Op.ne]: emplyoeeSosResponse.REJECTED } });
      util.setSuccess(200, "Active Sos retrived", activeSos);
      return util.send(res);

    } catch (error) {
      console.log('error in the getActiveSos in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
  static async getEmployeeActiveSos(req, res) {
    try {
      const { user } = req;
      const { id } = user;

      const activeSos = await SosService.getASos({ EmployeeId: id, status: sosStatus.ACTIVE, employeeResponse: { [Op.ne]: emplyoeeSosResponse.REJECTED } });
      util.setSuccess(200, "Active Sos retrived", activeSos);
      return util.send(res);

    } catch (error) {
      console.log('error in the getActiveSos in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async addSosFeedBack(req, res) {
    try {
      const { sosId } = req.body;

      const updatedSos = await SosService.updateSos(sosId, req.body);
      util.setSuccess(200, "Feedback Submitted", updatedSos);
      return util.send(res);
    } catch (err) {
      console.log('error in the getActiveSos in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async updateCurrentLocation(req, res) {
    try {
      const { sosId, currentLocation } = req.body;
      const signal = { currentLocation };
      console.log("sos id", signal, sosId)
      const updatedSos = await SosService.updateSos(sosId, signal);
      util.setSuccess(200, "Current location updated", updatedSos);
      return util.send(res);
    } catch (err) {
      console.log('error in the getActiveSos in SosController.js', err);
      util.setError(500, err);
      return util.send(res);
    }
  }
  static async endSosSignal(req, res) {
    try {
      const { sosId } = req.body;
      const signal = { id: sosId, ...req.body, status: sosStatus.COMPLETED };

      const updatedSos = await SosService.updateSos(sosId, signal);
      util.setSuccess(200, "Feedback Submitted", updatedSos);
      return util.send(res);
    } catch (err) {
      console.log('error in the getActiveSos in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
  static async getActiveSosEmployeeLocation(req, res) {
    try {
      const { user } = req;
      console.log(req.query)
      const { sosId } = req.query;

      const location = await SosService.getSosEmpLocation(sosId);
      util.setSuccess(200, "Active Sos retrived", location);
      return util.send(res);

    } catch (error) {
      console.log('error in the getActiveSosEmployeeLocation in SosController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
}

export default SosController;
