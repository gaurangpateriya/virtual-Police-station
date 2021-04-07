/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  FIR, Employee, User
} = database;
class FIRService {
  static async getAllFIRs(condition = null) {
    try {
      return await FIR.findAll({
        where: condition, include: [
          {
            model: Employee,
          },
          {
            model: User
          },

        ],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getAFIR(key, value) {
    try {
      return await FIR.findOne({ where: { [key]: value } });
    } catch (error) {
      throw error;
    }
  }
  static async getFirOverView() {
    try {
      return await FIR.count({
        group: ['status']
      });
    } catch (error) {
      throw error;
    }
  }



  static async addFIR(newFIR) {
    try {
      return await FIR.create(newFIR);
    } catch (error) {
      throw error;
    }
  }

  // method to update the FIR details in the database
  static async updateFIR(id, updateFIR) {
    try {
      const FIRToUpdate = await FIR.findOne({
        where: { id: Number(id) },
      });

      if (FIRToUpdate) {
        await FIRToUpdate.update(updateFIR);
        return updateFIR;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default FIRService;
