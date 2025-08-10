import * as UserCrud from "../crud/UserCrud.js";
import AppError from "../utils/AppError.js";
import { sendRecoveryEmail } from "../utils/mailer.js";

export const initiateReset = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserById(
      req.user._id.toString(),
      "+email +passwordChangeCode +passwordChangeCodeExpiration"
    );

    // if (new Date(user.passwordChangeCodeExpiration).getTime() > Date.now()) {
    //   throw new AppError(
    //     `Password reset already initiated. Check your inbox for a link valid until ${new Date(
    //       user.passwordChangeCodeExpiration
    //     )}`,
    //     400
    //   );
    // }

    const resetPasswordCode = crypto.randomUUID();
    user.passwordChangeCode = resetPasswordCode;
    const resetPasswordCodeExpiration = new Date(Date.now() + 5 * 60 * 1000);
    user.passwordChangeCodeExpiration = resetPasswordCodeExpiration;
    await user.save();

    await sendRecoveryEmail(user);

    res.status(200).json({
      status: "success",
      message: "Password reset initiated. Email with code delivered to inbox.",
    });
  } catch (err) {
    next(err);
  }
};

export const completeReset = async (req, res, next) => {
  try {
    const user = await UserCrud.getUserById(
      req.user._id.toString(),
      "+passwordChangeCode +passwordChangeCodeExpiration"
    );

    if (new Date(user.passwordChangeCodeExpiration).getTime() < Date.now()) {
      throw new AppError(`Password reset code expired. Please try again.`, 400);
    }

    if (user.passwordChangeCode !== req.body.code) {
      throw new AppError(
        `The provided code is not valid. Please try again.`,
        400
      );
    }

    delete req.body.code;
    await UserCrud.updateUserPassword(req.user._id.toString(), req.body);

    user.passwordChangeCode = "";
    user.passwordChangeCodeExpiration = new Date();
    await user.save();

    res.status(200).json({
      status: "success",
      message:
        "Password reset completed. You can sign in using the new password.",
    });
  } catch (err) {
    next(err);
  }
};
