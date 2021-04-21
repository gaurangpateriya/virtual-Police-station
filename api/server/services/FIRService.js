/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  FIR, Employee, User, FirImage
} = database;

const includeTables = [
  {
    model: Employee,
  },
  {
    model: User
  },
  {
    model: FirImage
  },
]
class FIRService {
  static async getAllFIRs(condition = null) {
    try {
      return await FIR.findAll({
        where: condition, include: [
          ...includeTables
        ],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getAFIR(key, value) {
    try {
      return await FIR.findOne({
        where: { [key]: value },
        include: includeTables
      });
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



  static async addFIR(newFIR, t) {
    try {
      return await FIR.create(newFIR, { transaction: t });
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
