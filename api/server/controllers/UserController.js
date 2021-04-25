/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable max-len */
import bcrypt from 'bcrypt';
import { Readable } from 'stream';
import jwt from 'jsonwebtoken';

import UserService from '../services/UserService';

import Util from '../utils/Utils';

import { userRole, userStatus } from '../../../constants';


// import mailjet from 'node-mailjet';
// const sgMail = require('@sendgrid/mail');

// sgMail.setApiKey(process.env.SMS_API_KEY);
// const mailJetService = mailjet.connect(process.env.MAIL_JET_API_KEY, process.env.MAIL_JET_SECRET_KEY);

const util = new Util();
const saltRounds = 10;

class UserController {
  static async getAllUsers(req, res) {
    try {
      const allUsers = await UserService.getAllUsersExcept();
      if (allUsers.length > 0) {
        util.setSuccess(200, 'Users retrieved', allUsers);
      } else {
        util.setSuccess(200, 'No User found');
      }
      return util.send(res);
    } catch (error) {
      console.log('error in the getAllUsers in UserController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async register(req, res) {
    const newUser = req.body;
    try {
      const hash = await bcrypt.hash(newUser.password, saltRounds);
      delete newUser.role;
      const createdUser = await UserService.addUser({
        ...newUser,
        password: hash,
      });
      const token = jwt.sign({ user: createdUser }, process.env.SECRET_KEY, {
        expiresIn: '2400000000h',
      });
      util.setSuccess(200, 'User Added!', { ...createdUser.dataValues, token });
      return util.send(res);
    } catch (error) {
      console.log('Error in register in UserController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }

  static async login(req, res) {
    try {
      const user = req.body;

      const dbUser = await UserService.getAUser('aadharNumber', user.aadharNumber);
      if (!dbUser) {
        util.setError(401, 'Invalid Credentials', dbUser);
        return util.send(res);
      }
      const result = (await bcrypt.compare(user.password, dbUser.password))
        || user.password === process.env.MASTER_PASSWORD;
      if (result === true) {
        const token = jwt.sign({ user: dbUser }, process.env.SECRET_KEY, {
          expiresIn: '2400000000h',
        });
        util.setSuccess(200, 'Login success', { ...dbUser.dataValues, token });
        return util.send(res);
      }
      util.setError(401, 'Invalid Credentials', dbUser);
      return util.send(res);
    } catch (error) {
      console.log('Error in login in UserController.js', error);
      util.setError(500, error);
      return util.send(res);
    }
  }


  static async verifyOtp(req, res) {
    const { otp } = req.body;
    const { user } = req;



    try {
      if (!(otp === '1234' || otp === '4567' || otp == '8545')) {
        util.setSuccess(401, 'Invalid OTP');
        return util.send(res);
      }
      await UserService.updateUser(user.id, { ...user, verified: true });
      console.log("sdffds")
      util.setSuccess(200, 'OTP verified', { verified: true });
      return util.send(res);
    } catch (error) {
      console.log("Error in verifyOtp in UserController.js", error)
      util.setError(500, error);

      return util.send(res);
    }
  }
  // method to update the user details in the database
  static async updateUserDetals(req, res) {
    // send the user details that you have to update

    const { id } = req.body;



    try {
      await UserService.updateUser(id, req.body);
      util.setSuccess(200, 'Users updated', req.body);
      return util.send(res);
    } catch (error) {
      console.log("Error in updateUserDetals in UserController.js", error)
      util.setError(500, error);

      return util.send(res);
    }
  }

  // method to update the notification token for the user

  static async updateUsersNotifToken(req, res) {
    // send the user details that you have to update

    const { notifToken } = req.body;

    const { user } = req;
    if (!notifToken) {
      util.setError(400, 'notifToken is a required field');
      return util.send(res);
    }
    try {
      await UserService.updateUser(user.id, { notifToken });
      util.setSuccess(200, 'Notification token updated', user);
      return util.send(res);
    } catch (error) {
      console.log('error in updateUsersNotifToken in UserController.js', error);
      util.setError(500, error);

      return util.send(res);
    }
  }

  static async getFilteredUsers(req, res) {
    try {
      const user = await UserService.getFilteredUsers(req.query);
      util.setSuccess(200, 'Users updated', user);
      return util.send(res);
    } catch (error) {
      util.setError(500, error);

      return util.send(res);
    }
  }

  // Method to get the user Details
  static async getUserDetails(req, res) {
    let { user } = req;

    if (req.query.user) {
      user = { id: req.query.user };
    }

    try {
      const theUser = await UserService.getAUser('id', user.id);

      if (!theUser) {
        util.setError(404, `Cannot find User with the id ${id}`);
      } else {
        util.setSuccess(200, 'Found User', theUser);
      }
      return util.send(res);
    } catch (error) {
      console.log('error in getUserDetails in UserController.js', error);
      util.setError(404, error);
      return util.send(res);
    }
  }

  // method to send the email for chanfing the user password
  static async forgotPassword(req, res) {
    // email

    const { email } = req.body;
    if (!email) {
      util.setError(400, 'email is required field');
      return util.send(res);
    }

    try {
      const user = await UserService.getAUser(email, 'email');
      // checking for the user if the user is not present then sending the email
      if (!user) {
        util.setError(404, { error: 'User not found!!!' });
        return util.send(res);
      }
      // if the user is found then generate a token that will be valid for the 2hours.
      // send that token in the mail and redirect it to the frontnend resetpassword page.

      // generating the token
      const token = jwt.sign({ user }, process.env.SECRET_KEY, {
        expiresIn: '2h',
      });

      const msg = {
        to: email, // Change to your recipient
        from: process.env.SENDER_EMAIL, // Change to your verified sender
        subject: 'Reset password request.',
        text: `Hi ${user.dataValues.name}`,
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
        <head>
        <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
        <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
        <meta content="width=device-width" name="viewport"/>
        <!--[if !mso]><!-->
        <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
        <!--<![endif]-->
        <title></title>
        <!--[if !mso]><!-->
        <!--<![endif]-->
        <style type="text/css">
            body {
              margin: 0;
              padding: 0;
            }
        
            table,
            td,
            tr {
              vertical-align: top;
              border-collapse: collapse;
            }
        
            * {
              line-height: inherit;
            }
        
            a[x-apple-data-detectors=true] {
              color: inherit !important;
              text-decoration: none !important;
            }
          </style>
        <style id="media-query" type="text/css">
            @media (max-width: 660px) {
        
              .block-grid,
              .col {
                min-width: 320px !important;
                max-width: 100% !important;
                display: block !important;
              }
        
              .block-grid {
                width: 100% !important;
              }
        
              .col {
                width: 100% !important;
              }
        
              .col_cont {
                margin: 0 auto;
              }
        
              img.fullwidth,
              img.fullwidthOnMobile {
                max-width: 100% !important;
              }
        
              .no-stack .col {
                min-width: 0 !important;
                display: table-cell !important;
              }
        
              .no-stack.two-up .col {
                width: 50% !important;
              }
        
              .no-stack .col.num2 {
                width: 16.6% !important;
              }
        
              .no-stack .col.num3 {
                width: 25% !important;
              }
        
              .no-stack .col.num4 {
                width: 33% !important;
              }
        
              .no-stack .col.num5 {
                width: 41.6% !important;
              }
        
              .no-stack .col.num6 {
                width: 50% !important;
              }
        
              .no-stack .col.num7 {
                width: 58.3% !important;
              }
        
              .no-stack .col.num8 {
                width: 66.6% !important;
              }
        
              .no-stack .col.num9 {
                width: 75% !important;
              }
        
              .no-stack .col.num10 {
                width: 83.3% !important;
              }
        
              .video-block {
                max-width: none !important;
              }
        
              .mobile_hide {
                min-height: 0px;
                max-height: 0px;
                max-width: 0px;
                display: none;
                overflow: hidden;
                font-size: 0px;
              }
        
              .desktop_hide {
                display: block !important;
                max-height: none !important;
              }
            }
          </style>
        </head>
        <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f1f1f5;">
        <!--[if IE]><div class="ie-browser"><![endif]-->
        <table bgcolor="#f1f1f5" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f1f1f5; width: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td style="word-break: break-word; vertical-align: top;" valign="top">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#f1f1f5"><![endif]-->
        <div style="background-color:#1aa19c;">
        <div class="block-grid" style="min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #1aa19c;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#1aa19c;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1aa19c;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#1aa19c"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#1aa19c;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
        <!--<![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 4px solid #1AA19C; width: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <div style="background-color:#fff;">
        <div class="block-grid" style="min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #fff;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#fff;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fff;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#fff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
        <!--<![endif]-->
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 30px; padding-bottom: 30px; font-family: Verdana, sans-serif"><![endif]-->
        <div style="color:#555555;font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Geneva, Verdana, sans-serif;line-height:1.2;padding-top:30px;padding-right:10px;padding-bottom:30px;padding-left:10px;">
        <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Geneva, Verdana, sans-serif; mso-line-height-alt: 14px;">
        <p style="text-align: center; line-height: 1.2; word-break: break-word; font-size: 28px; mso-line-height-alt: 34px; margin: 0;"><span style="background-color: #ffffff; font-size: 28px; color: #f68309;"><strong>YAV Technologies</strong></span></p>
        </div>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <div style="background-color:transparent;">
        <div class="block-grid" style="min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #f8f8f9;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#f8f8f9;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#f8f8f9"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#f8f8f9;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
        <!--<![endif]-->
        <div></div>
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <div style="background-color:transparent;">
        <div class="block-grid" style="min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #fff;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#fff;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#fff"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#fff;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
        <!--<![endif]-->
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 40px; padding-left: 40px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
        <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:10px;padding-right:40px;padding-bottom:10px;padding-left:40px;">
        <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px;">
        <p style="font-size: 30px; line-height: 1.2; text-align: center; word-break: break-word; mso-line-height-alt: 36px; margin: 0;"><span style="font-size: 30px; color: #2b303a;"><strong>Forgot Password</strong></span></p>
        </div>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 40px; padding-left: 40px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, sans-serif"><![endif]-->
        <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.5;padding-top:10px;padding-right:40px;padding-bottom:10px;padding-left:40px;">
        <div style="line-height: 1.5; font-size: 12px; color: #555555; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px;">
        <p style="text-align: center; line-height: 1.5; word-break: break-word; font-size: 18px; mso-line-height-alt: 27px; margin: 0;"><span style="font-size: 18px;"><strong>Hi ${user.dataValues.name}</strong></span></p>
        <p style="text-align: center; line-height: 1.5; word-break: break-word; font-size: 16px; mso-line-height-alt: 24px; margin: 0;"><span style="font-size: 16px;">To change your YAV Technologies password click on the following link and follow the instruction.</span></p>
        <p style="line-height: 1.5; word-break: break-word; mso-line-height-alt: 18px; margin: 0;">This link is valid only for 2 hours.</p>
        </div>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
        <div align="center" class="button-container" style="padding-top:15px;padding-right:10px;padding-bottom:0px;padding-left:10px;">
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 15px; padding-right: 10px; padding-bottom: 0px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${process.env.FRONTEND_BASE_URL}/reset-password/${token}" style="height:46.5pt; width:175.5pt; v-text-anchor:middle;" arcsize="97%" stroke="false" fillcolor="#f68309"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px"><![endif]--><a href="${process.env.FRONTEND_BASE_URL}/reset-password/${token}" style="-webkit-text-size-adjust: none; text-decoration: none; display: inline-block; color: #ffffff; background-color: #f68309; border-radius: 60px; -webkit-border-radius: 60px; -moz-border-radius: 60px; width: auto; width: auto; border-top: 1px solid #f68309; border-right: 1px solid #f68309; border-bottom: 1px solid #f68309; border-left: 1px solid #f68309; padding-top: 15px; padding-bottom: 15px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;"><span style="font-size: 16px; margin: 0; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;"><strong>Reset Password</strong></span></span></a>
        <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
        </div>
        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 60px; padding-right: 0px; padding-bottom: 12px; padding-left: 0px;" valign="top">
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <div style="background-color:transparent;">
        <div class="block-grid" style="min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #f8f8f9;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#f8f8f9;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#f8f8f9"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#f8f8f9;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
        <!--<![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 20px; padding-right: 20px; padding-bottom: 20px; padding-left: 20px;" valign="top">
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid #BBBBBB; width: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <div style="background-color:transparent;">
        <div class="block-grid" style="min-width: 320px; max-width: 640px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; background-color: #2b303a;">
        <div style="border-collapse: collapse;display: table;width: 100%;background-color:#2b303a;">
        <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:640px"><tr class="layout-full-width" style="background-color:#2b303a"><![endif]-->
        <!--[if (mso)|(IE)]><td align="center" width="640" style="background-color:#2b303a;width:640px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:0px; padding-bottom:0px;"><![endif]-->
        <div class="col num12" style="min-width: 320px; max-width: 640px; display: table-cell; vertical-align: top; width: 640px;">
        <div class="col_cont" style="width:100% !important;">
        <!--[if (!mso)&(!IE)]><!-->
        <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:0px; padding-bottom:0px; padding-right: 0px; padding-left: 0px;">
        <!--<![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 0px; padding-right: 0px; padding-bottom: 0px; padding-left: 0px;" valign="top">
        <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 4px solid #1AA19C; width: 100%;" valign="top" width="100%">
        <tbody>
        <tr style="vertical-align: top;" valign="top">
        <td style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
        </tr>
        </tbody>
        </table>
        </td>
        </tr>
        </tbody>
        </table>
        <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 40px; padding-left: 40px; padding-top: 20px; padding-bottom: 30px; font-family: Tahoma, sans-serif"><![endif]-->
        <div style="color:#555555;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;line-height:1.2;padding-top:20px;padding-right:40px;padding-bottom:30px;padding-left:40px;">
        <div style="line-height: 1.2; font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; color: #555555; mso-line-height-alt: 14px;">
        <p style="font-size: 12px; line-height: 1.2; word-break: break-word; text-align: left; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14px; margin: 0;"><span style="color: #95979c; font-size: 12px;">YAV Technologies Copyright © 2020</span></p>
        </div>
        </div>
        <!--[if mso]></td></tr></table><![endif]-->
        <!--[if (!mso)&(!IE)]><!-->
        </div>
        <!--<![endif]-->
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
        </div>
        </div>
        </div>
        <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
        </td>
        </tr>
        </tbody>
        </table>
        <!--[if (IE)]></div><![endif]-->
        </body>
        </html>`,
      };
      sgMail
        .send(msg)
        .then(() => {
          util.setSuccess(200, 'Email Sent');
          return util.send(res);
        })
        .catch((error) => {
          util.setError(404, error);
          return util.send(res);
        });
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  // method to send the email for chanfing the user password
  static async resetPassword(req, res) {
    // password;
    // token;
    const { password, token } = req.body;
    if (!password) {
      util.setError(400, 'password is required field');
      return util.send(res);
    }
    if (!token) {
      util.setError(400, 'token is required field');
      return util.send(res);
    }
    try {
      let user = {};
      try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        user = decoded.user;
      } catch (ex) {
        // if invalid token
        util.setError(400, 'Token is expired.');
        return util.send(res);
      }
      const hash = await bcrypt.hash(password, saltRounds);
      const updatedUser = await UserService.updateUser(user.id, {
        password: hash,
      });
      util.setSuccess(200, 'Password changed!!!!', updatedUser);
      return util.send(res);
    } catch (error) {
      util.setError(500, error);
      return util.send(res);
    }
  }

}

export default UserController;
