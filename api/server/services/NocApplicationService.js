/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  NocApplication, Station, User, NocApplicationDoc
} = database;

const includeTables = [

  {
    model: User
  },
  {
    model: NocApplicationDoc,
    as: 'relatedDocuments'

  },
  {
    model: Station
  }
]
class NocApplicationService {
  static async getAllNocApplications(condition = null) {
    try {
      return await NocApplication.findAll({
        where: condition, include: [
          ...includeTables
        ],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getANocApplication(key, value) {
    try {
      return await NocApplication.findOne({
        where: { [key]: value },
        include: includeTables
      });
    } catch (error) {
      throw error;
    }
  }
  static async getNocApplicationOverView(condition) {
    try {
      return await NocApplication.count({
        group: ['status'],
        where: condition
      });
    } catch (error) {
      throw error;
    }
  }



  static async addNocApplication(newNocApplication, t) {
    try {
      return await NocApplication.create(newNocApplication, { transaction: t });
    } catch (error) {
      throw error;
    }
  }

  // method to update the NocApplication details in the database
  static async updateNocApplication(id, updateNocApplication) {
    try {
      const NocApplicationToUpdate = await NocApplication.findOne({
        where: { id: Number(id) },
      });

      if (NocApplicationToUpdate) {
        await NocApplicationToUpdate.update(updateNocApplication);
        return updateNocApplication;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default NocApplicationService;
