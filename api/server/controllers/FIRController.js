/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */


import FIRService from '../services/FIRService';

import Util from '../utils/Utils';

import { emplyoeeFIRResponse, FIRRole, FIRStatus, employeeRoles } from '../../../constants';
import EmployeeService from '../services/EmployeeService';
import { sequelize } from '../src/models';
import { Op } from 'sequelize';




const util = new Util();

class FIRController {
  static async getAllFIR(req, res) {
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


      const allFIRs = await FIRService.getAllFIRs(condition);
      util.setSuccess(200, 'FIRs retrieved', allFIRs);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllFIRs in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async addFIR(req, res) {
    try {
      const { user } = req;
      const fir = await FIRService.addFIR({ ...req.body, UserId: user.id });
      util.setSuccess(200, 'FIR added', fir);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllFIRs in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getFirOverView(req, res) {
    try {

      const fir = await FIRService.getFirOverView();

      util.setSuccess(200, 'FIR OverView retrived', fir);
      return util.send(res);
    } catch (error) {
      console.log('error in the getFirOverView in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async updateFir(req, res) {
    try {
      const { id } = req.body;


      if (!id) {
        util.setError(400, "ID is required");
        return util.send(res);
      }

      const fir = await FIRService.updateFIR(req.body.id, req.body);
      util.setSuccess(200, 'FIR added', fir);
      return util.send(res);

    } catch (error) {
      console.log('error in the getAllFIRs in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

}

export default FIRController;
