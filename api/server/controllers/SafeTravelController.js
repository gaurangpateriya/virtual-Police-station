/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */


import SafeTravelService from '../services/SafeTravelService';

import Util from '../utils/Utils';
import path from 'path';
import { Op } from 'sequelize';

import { emplyoeeSafeTravelResponse, SafeTravelRole, SafeTravelStatus, employeeRoles } from '../../../constants';
import { sequelize } from '../src/models';
import { uploadImage } from '../utils/helpers';





const util = new Util();

class SafeTravelController {
  static async getAllSafeTravel(req, res) {
    try {
      const { user, query } = req
      let condition = query
      if (user.role !== employeeRoles.ADMIN) {
        if (user.role) {

        } else {
          condition = { UserId: user.id, ...condition }
        }
      }
      const allSafeTravels = await SafeTravelService.getAllSafeTravels(condition);
      util.setSuccess(200, 'SafeTravels retrieved', allSafeTravels);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllSafeTravels in SafeTravelController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async addSafeTravel(req, res) {
    const t = await sequelize.transaction()
    try {

      const body = req.body;
      const { user } = req;

      const safeTravel = await SafeTravelService.addSafeTravel({ ...body, UserId: user.id }, t);


      util.setSuccess(200, 'SafeTravel added', safeTravel);
      await t.commit();

      return util.send(res);
    } catch (error) {
      await t.rollback()
      console.log('error in the getAllSafeTravels in SafeTravelController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getSafeTravelOverView(req, res) {
    try {

      const SafeTravel = await SafeTravelService.getSafeTravelOverView(req.query);

      util.setSuccess(200, 'SafeTravel OverView retrived', SafeTravel);
      return util.send(res);
    } catch (error) {
      console.log('error in the getSafeTravelOverView in SafeTravelController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async updateSafeTravel(req, res) {
    try {
      const { id } = req.body;

      console.log(req.body)
      if (!id) {
        util.setError(400, "ID is required");
        return util.send(res);
      }

      const SafeTravel = await SafeTravelService.updateSafeTravel(id, req.body);
      util.setSuccess(200, 'SafeTravel added', SafeTravel);
      return util.send(res);

    } catch (error) {
      console.log('error in the getAllSafeTravels in SafeTravelController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

}

export default SafeTravelController;
