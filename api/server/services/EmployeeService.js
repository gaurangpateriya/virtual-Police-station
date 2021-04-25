/* eslint-disable no-await-in-loop */

import { Op } from 'sequelize';
import { employeeRoles } from '../../../constants';
import database, { sequelize } from '../src/models';


const {
  Employee, Station
} = database;
class EmployeeService {
  static async getAllEmployees(condition) {
    try {
      console.log(condition);
      return await Employee.findAll({ where: { ...condition } });
    } catch (error) {
      throw error;
    }
  }

  static async getAEmployee(key, value) {
    try {
      return await Employee.findOne({ where: { [key]: value }, include: [Station] });
    } catch (error) {
      throw error;
    }
  }

  static async getEmployeeOverView(condition) {
    try {
      return await Employee.count({
        group: ['role'],
        where: { ...condition, role: { [Op.ne]: employeeRoles.ADMIN } }
      });
    } catch (error) {
      throw error;
    }
  }

  static async getEmployeesWhere(condition) {
    try {
      return await Employee.findAll({ where: condition });
    } catch (error) {
      throw error;
    }
  }

  static async addEmployee(newEmployee) {
    try {
      return await Employee.create(newEmployee);
    } catch (error) {
      throw error;
    }
  }

  static async deleteEmployee(id) {
    try {
      return await Employee.destroy({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  // method to update the Employee details in the database
  static async updateEmployee(id, updateEmployee, t) {
    try {
      const EmployeeToUpdate = await Employee.findOne({
        where: { id: Number(id) },
      });

      if (EmployeeToUpdate) {
        await EmployeeToUpdate.update(updateEmployee, { transaction: t });
        return updateEmployee;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default EmployeeService;
