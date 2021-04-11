/* eslint-disable no-await-in-loop */

import database from '../src/models';


const {
  UserRelatives
} = database;

class UserRelativeService {
  static async getAllUserRelatives() {
    try {
      return await UserRelatives.findAll();
    } catch (error) {
      throw error;
    }
  }

  static async getAUserRelative(key, value) {
    try {
      return await UserRelatives.findOne({ where: { [key]: value } });
    } catch (error) {
      throw error;
    }
  }

  static async addUserRelative(newUserRelative) {
    try {
      return await UserRelatives.create(newUserRelative);
    } catch (error) {
      throw error;
    }
  }
  static async deleteUserRelative(id) {
    try {
      return await UserRelatives.destroy({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  // method to update the UserRelative details in the database
  static async updateUserRelative(id, updateUserRelative) {
    try {
      const UserRelativeToUpdate = await UserRelatives.findOne({
        where: { id: Number(id) },
      });

      if (UserRelativeToUpdate) {
        await UserRelativeToUpdate.update(updateUserRelative);
        return updateUserRelative;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

}

export default UserRelativeService;
