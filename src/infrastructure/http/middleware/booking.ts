import Joi from "joi";
import { Context } from "koa";

export default function validateBooking(
  ctx: Context,
  next: () => Promise<any>
): any {
  const schema = Joi.object({
    hotel_partner_ref: Joi.string().required(),
    room_type_partner_ref: Joi.string().required(),
    check_in: Joi.date().required(),
    check_out: Joi.date().required(),
    adults: Joi.number().required(),
    children: Joi.array().items(Joi.number()),
    price: Joi.object({
      amount: Joi.number(),
      currency: Joi.string(),
      decimalPlaces: Joi.number(),
    }),
    contactPerson: Joi.object({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
    }),
  });
  const result = schema.validate(ctx.request.body);

  if (!result.error) {
    return next();
  }

  ctx.body = { error: result.error.details[0].message };
  ctx.status = 400;
}
