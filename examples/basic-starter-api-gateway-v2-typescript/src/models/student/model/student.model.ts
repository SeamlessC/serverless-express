import * as yup from 'yup';
import { addPaymentType } from '../../payment/model/payment.model';

export const IStudentType = addPaymentType.pick(['bill_to_email','bill_to_forename',
'bill_to_phone','bill_to_surname','student_id']).shape({
    is_deleted : yup.boolean().default(false).required()
}).required().noUnknown();;

export type IStudent = yup.InferType<typeof IStudentType>

export const DefaultStudentObj = IStudentType.cast();