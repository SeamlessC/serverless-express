import { model, Schema, Types } from "mongoose";
import { currency_types, STATES } from "../../common/constants/enum";


const modification_note = {
    modified_by: String,
    modified_on: Date,
    modified_note: String
}
const schema = new Schema({
    transaction_uuid: {
        type: String,
        required: true,
        unique: true
    },
    reference_number: {
        type: String,
        required: true,
        unique: true
    },
    student_id: {
        type: String,
        required: true,
        ref: 'students'
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        required: true,
        enum: Object.values(currency_types)
    },
    state: {
        type: String,
        required: true,
        enum: Object.values(STATES)
    },
    program: {
        type: String,
        required: true
    },
    payment_type: {
        type: String,
        required: true
    },
    signed_date_time: {
        type: Date,
        required: true
    },
    is_deleted: {
        type: Boolean,
        default: false,
        required: true
    },
    modification_notes: {
        type: [modification_note]
    }

})

export default model('payments', schema);