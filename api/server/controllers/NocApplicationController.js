/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */


import NocApplicationService from '../services/NocApplicationService';
import Util from '../utils/Utils';
import { CERTIFICATE_TYPE, employeeRoles } from '../../../constants';
import { sequelize } from '../src/models';
import { Op } from 'sequelize';
import { uploadImage } from '../utils/helpers';
import NocApplicationDocService from '../services/NocApplicationDocService';


const util = new Util();



class NocApplicationController {
  static async getAvailableNocs(req, res) {
    try {

      const availableDocuments = [
        {
          name: CERTIFICATE_TYPE.CLEARENCE_CERTIFICATE,
          type: CERTIFICATE_TYPE.CLEARENCE_CERTIFICATE,
          fileName: "pcc.pdf",
          requiredDocuments: [
            { name: "Valid Passport", options: { type: 'application/pdf' } },
            { name: 'Passport Photo', options: { type: 'image/*' } },
            { name: 'Address Proof', options: { type: 'application/pdf' } },
            { name: 'Embassy Letter', options: { type: 'application/pdf' } },
          ]
        },
        {
          name: CERTIFICATE_TYPE.RALLY_NOC,
          type: CERTIFICATE_TYPE.RALLY_NOC,
          fileName: "rally_procession_noc.pdf",
          requiredDocuments: []
        }
      ]
      util.setSuccess(200, 'Available Documents retrieved', availableDocuments);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllNocApplications in NocApplicationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
  static async getAllNocApplications(req, res) {
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


      const allNocApplications = await NocApplicationService.getAllNocApplications(condition);
      util.setSuccess(200, 'NocApplications retrieved', allNocApplications);
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllNocApplications in NocApplicationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async addNocApplication(req, res) {
    const t = await sequelize.transaction()
    try {
      const files = req.files;
      const body = req.body;
      const { user } = req;
      body.UserId = user.id

      const otherDocuments = []
      for (let i = 0; i < files.length; i += 1) {
        const f = files[i];
        const fileUrl = await uploadImage(f);
        if (f.fieldname === 'form') {
          body.form = fileUrl
        } else {
          const { fieldname: name, mimetype: type } = f
          const fileData = { name, type, file: fileUrl, type };
          otherDocuments.push(fileData)

        }
      }

      const nocApplication = await NocApplicationService.addNocApplication(body, t);

      const { id: NocApplicationId } = nocApplication.dataValues;

      const addedDocs = []

      for (let i = 0; i < otherDocuments.length; i += 1) {
        const doc = otherDocuments[i];
        const fileData = { ...doc, NocApplicationId };
        const file = await NocApplicationDocService.addNocApplicationDoc(fileData, t);
        addedDocs.push(file)
      }

      // console.log(images, NocApplication)
      nocApplication.dataValues.relatedDocuements = addedDocs;

      util.setSuccess(200, 'NocApplication added', nocApplication);
      await t.commit();

      return util.send(res);
    } catch (error) {
      await t.rollback()
      console.log('error in the getAllNocApplications in NocApplicationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async verifyNoc(req, res) {

    try {
      const files = req.files;
      const body = req.body;
      let foundCertificate = false;
      for (let i = 0; i < files.length; i += 1) {
        const f = files[i];
        if (f.fieldname === 'verifiedCertificate') {
          const fileUrl = await uploadImage(f);
          body.verifiedCertificate = fileUrl
          foundCertificate = true
        }
      }
      if (foundCertificate) {
        const nocApplication = await NocApplicationService.updateNocApplication(body.id, body);
        util.setSuccess(200, 'NocApplication added', nocApplication);
        return util.send(res);
      }
      util.setSuccess(400, 'verifiedCertificate is a required filed');
      return util.send(res);
    } catch (error) {

      console.log('error in the getAllNocApplications in NocApplicationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }


  static async getNocApplicationOverView(req, res) {
    try {

      const NocApplication = await NocApplicationService.getNocApplicationOverView();

      util.setSuccess(200, 'NocApplication OverView retrived', NocApplication);
      return util.send(res);
    } catch (error) {
      console.log('error in the getNocApplicationOverView in NocApplicationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async updateNocApplication(req, res) {
    try {
      const { id } = req.body;


      if (!id) {
        util.setError(400, "ID is required");
        return util.send(res);
      }

      const NocApplication = await NocApplicationService.updateNocApplication(req.body.id, req.body);
      util.setSuccess(200, 'NocApplication added', NocApplication);
      return util.send(res);

    } catch (error) {
      console.log('error in the getAllNocApplications in NocApplicationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async getNocOverView(req, res) {
    try {

      const fir = await NocApplicationService.getNocApplicationOverView();

      util.setSuccess(200, 'Noc OverView retrived', fir);
      return util.send(res);
    } catch (error) {
      console.log('error in the getNocOverView in NocApplicationController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }
}

export default NocApplicationController;
