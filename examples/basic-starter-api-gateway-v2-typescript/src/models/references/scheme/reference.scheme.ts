import { model, Schema } from "mongoose";
import { references_types } from "../../common/constants/enum";

const scheme = new Schema({
    ref_name: {
        type: String,
        required: true
    },
    ref_type: {
        type: String,
        required: true,
        enum: Object.values(references_types)
    },
    ref_id: {
        type: String,
        unique : true,
        required: true
    },
    is_deleted: {
        type: Boolean,
        required: true
    }
})

export default model('references', scheme);
