import Joi from "joi";

export const OAuth2ParamValidator = Joi.object({
  // response_type: Joi.string().valid("code", "token").required(),
  response_type: Joi.string().valid("token").required(),
  client_id: Joi.string().max(100).required(),
  redirect_uri: Joi.string().uri().max(512).required(),
  scope: Joi.forbidden(),
  state: Joi.string().min(4).max(32).required(),
  code_challenge: Joi.forbidden(),
  code_challenge_method: Joi.forbidden(),
});
