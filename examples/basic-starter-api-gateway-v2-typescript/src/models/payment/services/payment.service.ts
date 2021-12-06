import { IPayment } from "../model/payment.model";
import payments from "../scheme/payment.schema";
import { Callback, CallbackError, Document, Error } from "mongoose";

export class PaymentService {
  public createPayment(
    payment_params: IPayment,
    callback: (err: CallbackError, data: Document) => void
  ) {
    const payment = new payments(payment_params);
    payment.save(callback);
  }

  public getPayments(
    filter: any,
    start: number,
    limit: number,
    sort: any,
    callback: (err: CallbackError, data: IPayment[]) => void
  ) {
    payments
      .aggregate([
        {
          $match: filter,
        },
        {
          $lookup: {
            from: "references",
            localField: "program",
            foreignField: "ref_id",
            as: "program_details",
          },
        },
        {
          $unwind: "$program_details",
        },
        {
          $lookup: {
            from: "references",
            localField: "payment_type",
            foreignField: "ref_id",
            as: "payment_type_details",
          },
        },
        {
          $unwind: "$payment_type_details",
        },
        {
          $lookup: {
            from: "students",
            localField: "student_id",
            foreignField: "student_id",
            as: "student",
          },
        },
        {
          $unwind: "$student",
        },
        {
          $project: {
            __v: 0,
            modification_notes: 0,
            currency: 0,
            _id: 0,
            "student._id": 0,
            "student.student_id": 0,
            "student.is_deleted": 0,
            "student.__v": 0,
            transaction_uuid: 0,
            is_deleted: 0,
            state: 0,
            "program_details._id": 0,
            "program_details.is_deleted": 0,
            "program_details.ref_id": 0,
            "program_details.ref_type": 0,
            "program_details.__v": 0,
            "program_details._v": 0,
            "payment_type_details._id": 0,
            "payment_type_details.is_deleted": 0,
            "payment_type_details.ref_id": 0,
            "payment_type_details.ref_type": 0,
            "payment_type_details.__v": 0,
            "payment_type_details._v": 0,
          },
        },
      ])
      .skip(start)
      .limit(limit)
      .sort(sort)
      .exec(callback);
  }

  public getPaymentsCount(
    filter: any,
    callback: (err: CallbackError, data: any[]) => void
  ) {
    payments
      .aggregate([
        {
          $match: filter,
        },
      ])
      .count("count")
      .exec(callback);
  }

  public getPayment(
    filter: any,
    callback: (err: CallbackError, data: any) => void
  ) {
    payments.findOne(filter).exec(callback);
  }
  public updatePayment(
    filter: any,
    update: any,
    callback: (err: CallbackError, data: any) => void
  ) {
    payments.findOneAndUpdate(filter, update, {}).exec(callback);
  }
}
