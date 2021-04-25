/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  Station, Employee, User,
} = database;

const includeTables = [

]
class StationService {
  static async getAllStations(condition = null) {
    try {
      return await Station.findAll({
        where: condition, include: [
          ...includeTables
        ],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getAStation(key, value) {
    try {
      return await Station.findOne({
        where: { [key]: value },
        include: includeTables
      });
    } catch (error) {
      throw error;
    }
  }
  static async getStationOverView() {
    try {
      return await Station.count({
        group: ['status']
      });
    } catch (error) {
      throw error;
    }
  }



  static async addStation(newStation, t) {
    try {
      return await Station.create(newStation, { transaction: t });
    } catch (error) {
      throw error;
    }
  }

  // method to update the Station details in the database
  static async updateStation(id, updateStation) {
    try {
      const StationToUpdate = await Station.findOne({
        where: { id: Number(id) },
      });

      if (StationToUpdate) {
        await StationToUpdate.update(updateStation);
        return updateStation;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default StationService;
