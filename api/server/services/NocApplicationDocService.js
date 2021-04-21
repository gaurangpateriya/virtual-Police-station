/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  NocApplicationDoc
} = database;

class NocApplicationDocService {
  static async getAllNocApplicationDocs(condition = null) {
    try {
      return await NocApplicationDoc.findAll({
        where: condition,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getANocApplicationDoc(key, value) {
    try {
      return await NocApplicationDoc.findOne({ where: { [key]: value } });
    } catch (error) {
      throw error;
    }
  }


  static async addNocApplicationDoc(newNocApplicationDoc, t) {
    try {
      return await NocApplicationDoc.create(newNocApplicationDoc, { transaction: t });
    } catch (error) {
      throw error;
    }
  }

  // method to update the NocApplicationDoc details in the database
  static async updateNocApplicationDoc(id, updateNocApplicationDoc) {
    try {
      const NocApplicationDocToUpdate = await NocApplicationDoc.findOne({
        where: { id: Number(id) },
      });

      if (NocApplicationDocToUpdate) {
        await NocApplicationDocToUpdate.update(updateNocApplicationDoc);
        return updateNocApplicationDoc;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default NocApplicationDocService;
