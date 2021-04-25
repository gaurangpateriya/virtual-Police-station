/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  SafeTravel, User, UserRelatives, Station
} = database;

const includeTables = [

  {
    model: User,
    include: UserRelatives
  },

  {
    model: Station
  }
]
class SafeTravelService {
  static async getAllSafeTravels(condition = null) {
    try {
      return await SafeTravel.findAll({
        where: condition, include: [
          ...includeTables
        ],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getASafeTravel(key, value) {
    try {
      return await SafeTravel.findOne({
        where: { [key]: value },
        include: includeTables
      });
    } catch (error) {
      throw error;
    }
  }
  static async getSafeTravelOverView(condition) {
    try {
      return await SafeTravel.count({
        group: ['status'],
        where: condition

      });
    } catch (error) {
      throw error;
    }
  }

  static async addSafeTravel(newSafeTravel, t) {
    try {
      return await SafeTravel.create(newSafeTravel, { transaction: t });
    } catch (error) {
      throw error;
    }
  }

  // method to update the SafeTravel details in the database
  static async updateSafeTravel(id, updateSafeTravel) {
    try {
      const SafeTravelToUpdate = await SafeTravel.findOne({
        where: { id: Number(id) },
      });

      if (SafeTravelToUpdate) {
        await SafeTravelToUpdate.update(updateSafeTravel);
        return updateSafeTravel;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default SafeTravelService;
