import { Types } from "mongoose";

export interface ICounter {
    _id ? : Types.ObjectId,
    date : string,
    count_number : number
}