/* eslint-disable no-await-in-loop */

import database, { sequelize } from '../src/models';


const {
  User
} = database;
class UserService {
  static async getAllUsers() {
    try {
      return await User.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async getAUser(key, value) {
    try {
      return await User.findOne({ where: { [key]: value } });
    } catch (error) {
      throw error;
    }
  }



  static async addUser(newUser) {
    try {
      return await User.create(newUser);
    } catch (error) {
      throw error;
    }
  }

  // method to update the user details in the database
  static async updateUser(id, updateUser, t) {
    try {
      const UserToUpdate = await User.findOne({
        where: { id: Number(id) },
      });

      if (UserToUpdate) {
        await UserToUpdate.update(updateUser, { transaction: t });
        return updateUser;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default UserService;
