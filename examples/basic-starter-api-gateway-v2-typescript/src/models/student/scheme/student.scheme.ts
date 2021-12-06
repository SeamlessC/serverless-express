import { model, Schema } from "mongoose";

const scheme = new Schema({

    student_id : {
        type : String,
        unique : true,
        required : true
    },
    bill_to_forename : {
        type : String,
        required : true
    },
    bill_to_surname : {
        type : String
    },
    bill_to_phone : {
        type : String
    },
    bill_to_email : {
        type : String
    },
    is_deleted : {
        type : Boolean,
        required : true,
        default : false
    }
})
export default model('students', scheme)