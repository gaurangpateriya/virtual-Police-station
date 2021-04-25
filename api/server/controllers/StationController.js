/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */


import StationService from '../services/StationService';

import Util from '../utils/Utils';
import { employeeRoles } from '../../../constants';
import { sequelize } from '../src/models';


const util = new Util();

class StationController {
  static async getAllStation(req, res) {
    try {
      const { query } = req
      let condition = query


      const allStations = await StationService.getAllStations(condition);
      util.setSuccess(200, 'Stations retrieved', allStations);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllStations in StationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async addStation(req, res) {
    const t = await sequelize.transaction()
    try {

      const body = req.body;

      const Station = await StationService.addStation({ ...body }, t);

      util.setSuccess(200, 'Station added', Station);
      await t.commit();

      return util.send(res);
    } catch (error) {
      await t.rollback()
      console.log('error in the getAllStations in StationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getStationOverView(req, res) {
    try {

      const Station = await StationService.getStationOverView();

      util.setSuccess(200, 'Station OverView retrived', Station);
      return util.send(res);
    } catch (error) {
      console.log('error in the getStationOverView in StationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async updateStation(req, res) {
    try {
      const { id } = req.body;


      if (!id) {
        util.setError(400, "ID is required");
        return util.send(res);
      }

      const Station = await StationService.updateStation(req.body.id, req.body);
      util.setSuccess(200, 'Station added', Station);
      return util.send(res);

    } catch (error) {
      console.log('error in the getAllStations in StationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

}

export default StationController;
