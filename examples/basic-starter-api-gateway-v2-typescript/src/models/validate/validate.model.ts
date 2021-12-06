import * as yup from "yup";

export const ValidateType = yup
  .object({
    amount: yup.string().required(),
    reference: yup.string().required(),
    paymentId: yup.string().required(),
    paymentDate: yup.number().required(),
    paymentStatus: yup.string().required(),
    signature: yup.string().required(),
    currency: yup.string().required(),
  })
  .required()
  .noUnknown();

export type TValidateType = yup.InferType<typeof ValidateType>;
