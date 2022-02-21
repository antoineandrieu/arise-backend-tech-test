import Joi from "joi";
import { Context } from "koa";

export default function validateAvailabilities(
  ctx: Context,
  next: () => Promise<any>
): any {
  const schema = Joi.object({
    hotel_id: Joi.array().items(Joi.string()).required(),
    check_in: Joi.date().required(),
    check_out: Joi.date().required(),
    adults: Joi.number().required(),
    children: Joi.array().items(Joi.number()),
  });
  const result = schema.validate(ctx.request.query);

  if (!result.error) {
    return next();
  }

  ctx.body = { error: result.error.details[0].message };
  ctx.status = 400;
}
