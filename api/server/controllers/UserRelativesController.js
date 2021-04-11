/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */


import UserRelativesService from '../services/UserRelativeService';

import Util from '../utils/Utils';
const util = new Util();


class UserRelativesController {

  static async addUserRelative(req, res) {
    try {
      const { UserId, name, mobileNo } = req.body
      if (!UserId) {
        util.setError(400, "UserId is required")
        return util.send(res);
      }
      if (!name) {
        util.setError(400, "name is required")
        return util.send(res);
      }
      if (!mobileNo) {
        util.setError(400, "mobileNo is required")
        return util.send(res);
      }
      const relative = await UserRelativesService.addUserRelative(req.body);
      util.setSuccess(200, 'UserRelatives added', relative);
      return util.send(res);
    } catch (error) {
      console.log('error in the addUserRelative in UserRelativesController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async updateUserRelative(req, res) {
    try {
      const { id, UserId, name, mobileNo } = req.body;
      if (!id) {
        util.setError(400, "id is required")
        return util.send(res);
      }
      if (!UserId) {
        util.setError(400, "UserId is required")
        return util.send(res);
      }
      if (!name) {
        util.setError(400, "name is required")
        return util.send(res);
      }
      if (!mobileNo) {
        util.setError(400, "mobileNo is required")
        return util.send(res);
      }
      const relative = await UserRelativesService.updateUserRelative(id, req.body);
      util.setSuccess(200, 'UserRelatives updated', relative);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllUserRelativess in UserRelativesController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async deleteUserRelative(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        util.setError(400, "id is required")
        return util.send(res);
      }

      const relative = await UserRelativesService.deleteUserRelative(id);
      util.setSuccess(200, 'UserRelatives deleted', relative);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllUserRelativess in UserRelativesController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }




}

export default UserRelativesController;
