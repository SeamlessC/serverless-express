import * as yup from 'yup';
import { references_types } from '../../common/constants/enum';

export const IReferenceType = yup.object().shape({
    ref_id : yup.string().required(),
    ref_name: yup.string().required('Reference name is required'),
    ref_type : yup.mixed().required("Reference Type is required").oneOf([references_types]),
    is_deleted : yup.boolean().default(false),
}).required().noUnknown()

export const addReferenceType = IReferenceType.omit(['is_deleted'])

export type IReferences = yup.InferType<typeof IReferenceType>
export const DefaultReferenceObj = IReferenceType.cast();