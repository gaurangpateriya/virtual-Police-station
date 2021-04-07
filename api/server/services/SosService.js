/* eslint-disable no-await-in-loop */

import moment from 'moment';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize';
import database, { sequelize } from '../src/models';


const {
  Sos, Employee, User,
} = database;

class SosService {
  static async getAllSos(condition = {}) {
    try {
      return await Sos.findAll({
        where: condition,
        include: [
          { model: Employee },
          { model: User },
        ],
        order: [['updatedAt', 'DESC']],
      });
    } catch (error) {
      throw error;
    }
  }

  static async getASos(condition) {
    try {
      return await Sos.findOne({
        where: condition, include: [
          { model: User }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  static async getOverview() {
    try {
      const overview = await Sos.count({

        group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt'))],
        createdAt: {
          [Op.gte]: moment().subtract(7, 'days').toDate()
        }
      })
      return overview;

    } catch (error) {
      throw error
    }
  }
  static async getSosEmpLocation(sosId) {
    try {
      return await Sos.findOne({
        where: { id: sosId },
        include: [
          { model: Employee }
        ]
      });
    } catch (error) {
      throw error;
    }
  }

  static async addSos(newSos) {
    try {
      return await Sos.create(newSos);
    } catch (error) {
      throw error;
    }
  }

  // method to update the Sos details in the database
  static async updateSos(id, updateSos) {
    try {

      const SosToUpdate = await Sos.findOne({
        where: { id: Number(id) },
      });

      if (SosToUpdate) {
        await SosToUpdate.update(updateSos);
        return await Sos.findOne({
          where: { id: Number(id) },
          include: [
            { model: Employee }
          ]
        });
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default SosService;
