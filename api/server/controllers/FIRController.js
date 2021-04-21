/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */


import FIRService from '../services/FIRService';

import Util from '../utils/Utils';
import path from 'path';

import { emplyoeeFIRResponse, FIRRole, FIRStatus, employeeRoles } from '../../../constants';
import EmployeeService from '../services/EmployeeService';
import { sequelize } from '../src/models';
import { Op } from 'sequelize';
import { uploadImage } from '../utils/helpers';
import FirImageService from '../services/FirImageServices';




const util = new Util();

const uploadFirImage = async (image) => {
  try {



  } catch (err) {

  }
}

//Capture




class FIRController {
  static async getAllFIR(req, res) {
    try {
      const { user, query } = req
      let condition = query
      if (user.role !== employeeRoles.ADMIN) {
        if (user.role) {
          condition = { EmployeeId: user.id, ...condition }
        } else {

          condition = { UserId: user.id, ...condition }
        }
      }


      const allFIRs = await FIRService.getAllFIRs(condition);
      util.setSuccess(200, 'FIRs retrieved', allFIRs);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllFIRs in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async addFIR(req, res) {
    const t = await sequelize.transaction()
    try {
      const files = req.files;
      const body = req.body;
      const { user } = req;

      const fir = await FIRService.addFIR({ ...body, UserId: user.id }, t);

      const { id: FIRId } = fir.dataValues;
      const images = []
      for (let i = 0; i < files.length; i += 1) {
        const f = files[i];
        const { fieldname: name, mimetype: type } = f
        const imageUrl = await uploadImage(f);
        const imageData = { FIRId, name, type, image: imageUrl };
        const image = await FirImageService.addFirImage(imageData, t);
        images.push(image)

      }
      // console.log(images, fir)
      fir.dataValues.FirImages = images;

      util.setSuccess(200, 'FIR added', fir);
      await t.commit();

      return util.send(res);
    } catch (error) {
      await t.rollback()
      console.log('error in the getAllFIRs in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getFirOverView(req, res) {
    try {

      const fir = await FIRService.getFirOverView();

      util.setSuccess(200, 'FIR OverView retrived', fir);
      return util.send(res);
    } catch (error) {
      console.log('error in the getFirOverView in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async updateFir(req, res) {
    try {
      const { id } = req.body;


      if (!id) {
        util.setError(400, "ID is required");
        return util.send(res);
      }

      const fir = await FIRService.updateFIR(req.body.id, req.body);
      util.setSuccess(200, 'FIR added', fir);
      return util.send(res);

    } catch (error) {
      console.log('error in the getAllFIRs in FIRController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

}

export default FIRController;
