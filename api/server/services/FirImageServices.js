/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  FirImage, Employee, User
} = database;

class FirImageService {
  static async getAllFirImages(condition = null) {
    try {
      return await FirImage.findAll({
        where: condition,
      });
    } catch (error) {
      throw error;
    }
  }

  static async getAFirImage(key, value) {
    try {
      return await FirImage.findOne({ where: { [key]: value } });
    } catch (error) {
      throw error;
    }
  }


  static async addFirImage(newFirImage, t) {
    try {
      return await FirImage.create(newFirImage, { transaction: t });
    } catch (error) {
      throw error;
    }
  }

  // method to update the FirImage details in the database
  static async updateFirImage(id, updateFirImage) {
    try {
      const FirImageToUpdate = await FirImage.findOne({
        where: { id: Number(id) },
      });

      if (FirImageToUpdate) {
        await FirImageToUpdate.update(updateFirImage);
        return updateFirImage;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
}

export default FirImageService;
