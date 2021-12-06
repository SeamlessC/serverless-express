import * as yup from "yup";
import { object } from "yup/lib/locale";
import { transaction_type } from "../../common/constants/constant";
import { currency_types, STATES } from "../../common/constants/enum";
import { IReferenceType } from "../../references/model/reference.model";

export const addPaymentType = yup
  .object()
  .shape({
    student_id: yup.string().required("Student id is required"),
    bill_to_email: yup.string().email().required("Student email is required"),
    bill_to_forename: yup.string().required("Student first name is required"),
    bill_to_phone: yup.string().min(9).required("Student phone is required"),
    bill_to_surname: yup.string().required("Student surname is required"),
    program: yup.string().required("Program is required"),
    payment_type: yup.string().required("Payment type is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount should be positive"),
    signed_date_time: yup.string().required("Date is required"),
    currency: yup.string().required().default(currency_types.LKR),
  })
  .required()
  .noUnknown();

export const IPaymentTypeX = yup
  .object({
    student_id: yup.string().required("Student id is required"),
    program: yup.string().required("Program is required"),
    payment_type: yup.string().required("Payment type is required"),
    amount: yup
      .number()
      .required("Amount is required")
      .positive("Amount should be positive"),
    signed_date_time: yup.string().required("Date is required"),
    _id: yup.string().notRequired(),
    transaction_uuid: yup.string().uuid().required(),
    reference_number: yup.string().required(),
    currency: yup.string().required().default(currency_types.LKR),
    state: yup.mixed().required().default(STATES.PENDING).oneOf([STATES]),
    is_deleted: yup.boolean().default(false),
    modification_notes: yup
      .object()
      .shape({
        modified_by: yup.string().required(),
        modified_on: yup.date().required(),
        modified_note: yup.string().required(),
      })
      .required(),
    program_details: yup.object().shape({ IReferenceType }).notRequired(),
    payment_type_details: yup.object().shape({ IReferenceType }).notRequired(),
    student: yup.object().notRequired(),
  })
  .required()
  .noUnknown();
export const IPaymentType = addPaymentType
  .omit([
    "bill_to_email",
    "bill_to_forename",
    "bill_to_phone",
    "bill_to_surname",
  ])
  .shape({
    _id: yup.string().notRequired(),
    transaction_uuid: yup.string().uuid().required(),
    reference_number: yup.string().required(),
    currency: yup.string().required().default(currency_types.LKR),
    state: yup.mixed().required().default(STATES.PENDING).oneOf([STATES]),
    is_deleted: yup.boolean().default(false),
    modification_notes: yup
      .object()
      .shape({
        modified_by: yup.string().required(),
        modified_on: yup.date().required(),
        modified_note: yup.string().required(),
      })
      .required(),
    program_details: yup.object().shape({ IReferenceType }).notRequired(),
    payment_type_details: yup.object().shape({ IReferenceType }).notRequired(),
    student: yup.object().notRequired(),
  })
  .required()
  .noUnknown();

export const ISignDataType = IPaymentType.omit([
  "student_id",
  "program",
  "payment_type",
  "state",
  "is_deleted",
  "_id",
  "program_details",
  "payment_type_details",
  "student",
  "modification_notes",
])
  .shape({
    profile_id: yup
      .string()
      .default(process.env.PROFILE_ID as string)
      .required(),
    access_key: yup.string().required(),
  })
  .required()
  .noUnknown();

export const filterDataType = yup
  .object()
  .shape({
    student_id: yup.string().notRequired(),
    program: yup.string().notRequired(),
    payment_type: yup.string().notRequired(),
    reference_number: yup.string().notRequired(),
    start_date: yup.string().notRequired(),
    end_date: yup.string().notRequired(),
    ascend: yup.string().notRequired(),
    descend: yup.string().notRequired(),
    start: yup.number().integer().required(),
    limit: yup.number().integer().required(),
  })
  .required()
  .noUnknown();

export const approvePaymentType = yup.object().shape({
  req_transaction_uuid: yup.string().required(),
  decision: yup.string().required(),
});

export type TypeAddPayment = yup.InferType<typeof addPaymentType>;
export type IPayment = yup.InferType<typeof IPaymentType>;
export type IPaymentX = yup.InferType<typeof IPaymentTypeX>;
export type ISignData = yup.InferType<typeof ISignDataType>;

export const DefaultPaymentObj = IPaymentType.cast();
export const DefaultSignDataObj = ISignDataType.cast();
