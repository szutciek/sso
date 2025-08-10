import nodemailer from "nodemailer";
import { server, email } from "../config.js";

const baseUrl = server.baseUrl;

const transporter = nodemailer.createTransport({
  host: email.host,
  port: email.port,
  secure: true,
  auth: {
    user: email.user,
    pass: email.password,
  },
});

export const sendRecoveryEmail = async (user) => {
  return new Promise(async (res, rej) => {
    try {
      const recoveryUrl = `${baseUrl}/user/${user._id}/reset-password?code=${user.passwordChangeCode}`;

      const mail = {
        from: email.user,
        subject: "Kanapka SSO Password Reset",
        to: user.email,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Password Reset</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    table {
      border-collapse: collapse;
    }
  </style>
</head>
<body>
  <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
          <tr>
            <td>
              <h2>Password Reset Request</h2>
              <p>Hello,</p>
              <p>You requested to reset your password. Click the button below to set a new password:</p>

              <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                <tr>
                  <td bgcolor="#007BFF" style="border-radius: 5px;">
                    <a href="${recoveryUrl}" target="_blank" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                  </td>
                </tr>
              </table>

              <p style="margin-top: 30px;">If you didn’t request this, please ignore this email.</p>
              <p>Thanks,<br>Kanapka SSO</p>
            </td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #777; text-align: center;">
              <p>If you're having trouble, copy and paste this link into your browser:</p>
              <p><a href="${recoveryUrl}" style="color: #007BFF;">${recoveryUrl}</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      };

      await transporter.sendMail(mail);

      res();
    } catch (err) {
      rej(err);
    }
  });
};

export const sendVerificationEmail = async (user) => {
  return new Promise(async (res, rej) => {
    try {
      const verificationUrl = `${baseUrl}/verify?email=${user.email}&code=${user.emailVerificationCode}`;

      const mail = {
        from: email.user,
        subject: "Kanapka SSO Email Verification",
        to: user.email,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verification</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    table {
      border-collapse: collapse;
    }
  </style>
</head>
<body>
  <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
          <tr>
            <td>
              <h2>Email Verification Request</h2>
              <p>Hello,</p>
              <p>Thanks for signing up to this revolutionary website. Click the button below to verify your email:</p>

              <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                <tr>
                  <td bgcolor="#007BFF" style="border-radius: 5px;">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 5px;">Verify email</a>
                  </td>
                </tr>
              </table>

              <p style="margin-top: 30px;">If you didn’t sign up, please ignore this email.</p>
              <p>Thanks,<br>Kanapka SSO</p>
            </td>
          </tr>
          <tr>
            <td style="font-size: 12px; color: #777; text-align: center;">
              <p>If you're having trouble, copy and paste this link into your browser:</p>
              <p><a href="${verificationUrl}" style="color: #007BFF;">${verificationUrl}</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      };

      await transporter.sendMail(mail);

      res();
    } catch (err) {
      rej(err);
    }
  });
};

export const send2FAEmail = async (user) => {
  return new Promise(async (res, rej) => {
    try {
      const mail = {
        from: email.user,
        subject: "Kanapka SSO 2FA Code",
        to: user.email,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>2FA Code</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    table {
      border-collapse: collapse;
    }
  </style>
</head>
<body>
  <table width="100%" bgcolor="#f4f4f4" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center">
        <table width="600" bgcolor="#ffffff" cellpadding="20" cellspacing="0" style="font-family: Arial, sans-serif; color: #333;">
          <tr>
            <td>
              <h2>2FA Code Request</h2>
              <p>Hello,</p>
              <p>Thanks for using this revolutionary website. Below is your 2FA code:</p>

              <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px;">
                <tr>
                  <td bgcolor="#007BFF" style="border-radius: 5px;">
                    <a target="_blank" style="display: inline-block; padding: 12px 20px; font-size: 16px; color: #ffffff; text-decoration: none; border-radius: 5px;">${user.code2FA}</a>
                  </td>
                </tr>
              </table>

              <p style="margin-top: 30px;">If you didn’t request a code, please ignore this email.</p>
              <p>Thanks,<br>Kanapka SSO</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
      };

      await transporter.sendMail(mail);

      res();
    } catch (err) {
      rej(err);
    }
  });
};
