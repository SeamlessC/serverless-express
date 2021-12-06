import { Request, Response } from "express";
import { PaymentService } from "../models/payment/services/payment.service";
import {
  addPaymentType,
  approvePaymentType,
  DefaultPaymentObj,
  DefaultSignDataObj,
  filterDataType,
  IPaymentType,
  IPaymentX,
  ISignDataType,
} from "../models/payment/model/payment.model";
import { AbstractControllClass } from "./abstract.controller";
import { CallbackError, Document, Error } from "mongoose";
import {
  CREATED,
  NOT_FOUND_MESSAGE,
  SERVER_ERROR_MESSAGE_CREATE,
  SERVER_ERROR_MESSAGE_READ,
  SERVER_ERROR_MESSAGE_UPDATE,
} from "../models/common/constants/constant";
import { modification_note, STATES } from "../models/common/constants/enum";
import queryBuilder from "smc-mongoose-query-builder-helper";
import { IReferences } from "../models/references/model/reference.model";
import { StudentService } from "../models/student/services/student.service";
import {
  DefaultStudentObj,
  IStudent,
} from "../models/student/model/student.model";
import { v4 as uuidv4 } from "uuid";
import { CounterService } from "../models/counter/service/counter.service";
import { ICounter } from "../models/counter/model/counter.model";
import { IStudentType } from "../models/student/model/student.model";
import { IPayment, ISignData } from "../models/payment/model/payment.model";
import paginated_service from "../models/common/services/paginated_service.service";
import { TValidateType, ValidateType } from "../models/validate/validate.model";
import md5 from "md5";
import { object, string } from "yup";
import runEmailWorker from "./email.controller";
import { format } from "date-fns-tz";
import { parseISO } from "date-fns";
import { ObjectId } from "mongodb";
export class PaymentController extends AbstractControllClass {
  private paymentService: PaymentService = new PaymentService();
  private studentService: StudentService = new StudentService();
  private counterService: CounterService = new CounterService();

  insertData(req: Request, res: Response) {
    addPaymentType
      .validate(req.body)
      .then((valid: any) => {
        if (valid) {
          let filter: any = {};
          const ids: string[] = [];
          ids.push(req.body.payment_type, req.body.program);
          filter = queryBuilder.arrayElementMatcher(filter, "ref_id", ids);
          this.referenceService.getReference(
            filter,
            (errGetReferences: CallbackError, ref_data: IReferences[]) => {
              if (errGetReferences) {
                this.responseServices.internalServerError(
                  res,
                  SERVER_ERROR_MESSAGE_READ,
                  errGetReferences
                );
              } else if (ref_data && ref_data.length === 2) {
                filter = {};
                filter = queryBuilder.valueMatcher(
                  filter,
                  "date",
                  this.dateService.getDateString(Date.now())
                );
                this.counterService.findAndUpdateCounter(
                  filter,
                  (errGetCount: CallbackError, count_data: ICounter) => {
                    if (errGetCount) {
                      this.responseServices.internalServerError(
                        res,
                        SERVER_ERROR_MESSAGE_READ,
                        errGetCount
                      );
                    } else {
                      req.body.reference_number =
                        "REF_" +
                        count_data.date +
                        "_" +
                        count_data.count_number;
                      req.body.transaction_uuid = uuidv4();

                      filter = {};
                      filter = queryBuilder.valueMatcher(
                        filter,
                        "student_id",
                        req.body.student_id
                      );
                      const student: IStudent = this.objectCreateFunction(
                        Object.keys(IStudentType.fields),
                        DefaultStudentObj,
                        req.body,
                        IStudentType
                      );

                      this.studentService.createOrUpdateStudent(
                        filter,
                        student,
                        (
                          errCreateStudents: CallbackError,
                          stu_data: IStudent
                        ) => {
                          if (errCreateStudents) {
                            this.responseServices.internalServerError(
                              res,
                              SERVER_ERROR_MESSAGE_UPDATE,
                              errCreateStudents
                            );
                          } else {
                            const modification_notes: modification_note[] = [
                              {
                                modified_by: req.body.student_id,
                                modified_on: new Date(
                                  req.body.signed_date_time
                                ),
                                modified_note: CREATED,
                              },
                            ];
                            const payment: IPayment = this.objectCreateFunction(
                              Object.keys(IPaymentType.fields),
                              DefaultPaymentObj,
                              req.body,
                              IPaymentType
                            );
                            payment["modification_notes"] = modification_notes;

                            this.paymentService.createPayment(
                              payment,
                              (
                                errCreatePayment: CallbackError,
                                dataPayment: any
                              ) => {
                                if (errCreatePayment) {
                                  this.responseServices.internalServerError(
                                    res,
                                    SERVER_ERROR_MESSAGE_CREATE,
                                    errCreatePayment
                                  );
                                } else {
                                  const unorderedSignData: ISignData =
                                    this.objectCreateFunction(
                                      Object.keys(ISignDataType.fields),
                                      DefaultSignDataObj,
                                      req.body,
                                      ISignDataType
                                    );
                                  this.responseServices.successResponse(res, {
                                    ...unorderedSignData,
                                    access_key:
                                      dataPayment?.currency === "USD"
                                        ? process.env.USD_ACCESS_KEY
                                        : process.env.LKR_ACCESS_KEY,
                                  });
                                }
                              }
                            );
                          }
                        }
                      );
                    }
                  }
                );
              } else {
                this.responseServices.unProcessableEntity(
                  res,
                  "Programme or payment type not found! Please contact the administrator!"
                );
              }
            }
          );
        } else {
        }
      })
      .catch((errors: any) => {
        this.responseServices.insufficientParametersResponse(res, errors);
      });
  }
  getAllData(req: Request, res: Response) {
    filterDataType
      .validate(req.query)
      .then((valid: any) => {
        if (valid) {
          let filter: any = {};
          let start: number = req.query.start
            ? parseInt(req.query.start.toString())
            : 0;
          let limit: number = req.query.limit
            ? parseInt(req.query.limit.toString())
            : 100;
          if (req.query.program || req.query.payment_type) {
            const arrCreate = (word: string) => {
              const strArr = word.split(",");
              const arr: string[] = [];
              strArr.forEach((str) => {
                arr.push(str);
              });
              return arr;
            };
            if (req.query.program) {
              const program_ids: string[] = arrCreate(
                req.query.program.toString()
              );
              filter = queryBuilder.arrayElementMatcher(
                filter,
                "program",
                program_ids
              );
            }
            if (req.query.payment_type) {
              const payment_ids: string[] = arrCreate(
                req.query.payment_type.toString()
              );
              filter = queryBuilder.arrayElementMatcher(
                filter,
                "payment_type",
                payment_ids
              );
            }
          }
          filter = queryBuilder.patternMatcher(
            filter,
            "student_id",
            req.query.student_id
          );
          filter = queryBuilder.patternMatcher(
            filter,
            "reference_number",
            req.query.reference_number
          );
          filter = queryBuilder.valueMatcher(filter, "is_deleted", false);
          filter = queryBuilder.valueMatcher(filter, "state", STATES.APPROVED);
          if (req.query.start_date && req.query.end_date) {
            filter.$and = [
              {
                signed_date_time: {
                  $gte: req.query.start_date
                    ? new Date(req.query.start_date.toString())
                    : "-",
                },
              },
              {
                signed_date_time: {
                  $lte: req.query.end_date
                    ? new Date(req.query.end_date.toString())
                    : "-",
                },
              },
            ];
          } else if (req.query.start_date) {
            filter.$and = [
              {
                signed_date_time: {
                  $gte: req.query.start_date
                    ? new Date(req.query.start_date.toString())
                    : "-",
                },
              },
              {
                signed_date_time: {
                  $lte: req.query.start_date
                    ? new Date(req.query.start_date.toString())
                    : "-",
                },
              },
            ];
          } else if (req.query.end_date) {
            filter.$and = [
              {
                signed_date_time: {
                  $gte: req.query.end_date
                    ? new Date(req.query.end_date.toString())
                    : "-",
                },
              },
              {
                signed_date_time: {
                  $lte: req.query.end_date
                    ? new Date(req.query.end_date.toString())
                    : "-",
                },
              },
            ];
          }

          this.paymentService.getPaymentsCount(
            filter,
            (errGetCount: CallbackError, data: any[]) => {
              if (errGetCount) {
                this.responseServices.internalServerError(
                  res,
                  SERVER_ERROR_MESSAGE_READ,
                  errGetCount
                );
              } else if (!!data[0] && data[0].count > 0) {
                let end = 0;
                const data_length = ({ start, end } = paginated_service(
                  start,
                  limit,
                  data[0].count
                ));
                const sort = {
                  signed_date_time: req.query.sort === "ascend" ? 1 : -1,
                };
                this.paymentService.getPayments(
                  filter,
                  data_length.start,
                  data_length.end,
                  sort,
                  (errGetPayments: CallbackError, payments: IPayment[]) => {
                    if (errGetPayments) {
                      this.responseServices.internalServerError(
                        res,
                        SERVER_ERROR_MESSAGE_READ,
                        errGetPayments
                      );
                    } else {
                      this.responseServices.successResponse(res, {
                        total_count: data[0].count,
                        visible_data_count: payments.length,
                        data: payments,
                      });
                    }
                  }
                );
              } else {
                this.responseServices.successResponse(res, {
                  count: 0,
                  data: [],
                });
              }
            }
          );
        }
      })
      .catch((errors: any) => {
        this.responseServices.insufficientParametersResponse(res, errors);
      });
  }
  public async getPayment(req: Request, res: Response) {
    const { uuid } = await object({ uuid: string().uuid().required() })
      .required()
      .noUnknown()
      .validate(req.body);
    let filter: any = {};
    filter = queryBuilder.valueMatcher(filter, "is_deleted", false);
    filter = queryBuilder.valueMatcher(filter, "transaction_uuid", uuid);
    filter = queryBuilder.valueMatcher(filter, "state", [
      STATES.APPROVED,
      STATES.FAILURE,
    ]);
    this.paymentService.getPayment(
      filter,
      (errUpdatePayment: CallbackError, data: any) => {
        if (errUpdatePayment) {
          return this.responseServices.internalServerError(
            res,
            SERVER_ERROR_MESSAGE_UPDATE,
            errUpdatePayment
          );
        }
        if (data) {
          return this.responseServices.successResponse(res, {
            reference: data.reference_number,
            state: data.state,
          });
        }
        return this.responseServices.NotFound(res);
      }
    );
  }
  public async approvePayment(req: Request, res: Response) {
    try {
      const {
        amount,
        paymentDate,
        paymentId,
        paymentStatus,
        reference,
        signature,
        currency,
      }: TValidateType = await ValidateType.validate(req.body);
      const privateValue =
        currency === "USD" ? process.env.USD_PRIVATE : process.env.LKR_PRIVATE;
      const validateString = md5(
        `${amount}${reference}${paymentId}${paymentDate}${paymentStatus}${privateValue}`
      ).toUpperCase();
      let filter: any = {};
      let update: any;
      filter = queryBuilder.valueMatcher(filter, "reference_number", reference);
      filter = queryBuilder.valueMatcher(filter, "is_deleted", false);
      // filter = queryBuilder.valueMatcher(filter, "state", STATES.PENDING);
      if (validateString === signature) {
        update =
          paymentStatus === STATES.APPROVED
            ? { state: STATES.APPROVED }
            : { state: STATES.FAILURE };
      } else {
        update = { state: STATES.FAILURE, is_deleted: true };
      }

      this.paymentService.updatePayment(
        filter,
        update,
        async (errUpdatePayment: CallbackError, data_update: IPaymentX) => {
          if (errUpdatePayment) {
            return this.responseServices.internalServerError(
              res,
              SERVER_ERROR_MESSAGE_UPDATE,
              errUpdatePayment
            );
          }
          if (!!data_update) {
            if (validateString !== signature) {
              return this.responseServices.Forbidden(res);
            }
            if (paymentStatus !== STATES.APPROVED) {
              return this.responseServices.NotAcceptable(
                res,
                null,
                data_update.reference_number
              );
            }
            const {
              amount,
              currency,
              student_id,
              reference_number,
              signed_date_time,
              program,
              payment_type,
              _id,
            } = data_update;
            try {
              const student: IStudent =
                await this.studentService.getStudentById(student_id);
              const { bill_to_email, bill_to_forename, bill_to_surname } =
                student;
              const filter = queryBuilder.arrayElementMatcher({}, "ref_id", [
                program,
                payment_type,
              ]);
              const references: IReferences[] =
                await this.referenceService.getReferenceAsync(filter);
              let paymentFor: string = "";
              let programme: string = "";
              references.map((item) => {
                if (item.ref_id === payment_type) {
                  paymentFor = item.ref_name;
                }
                if (item.ref_id === program) {
                  programme = item.ref_name;
                }

                return;
              });
              const info = await runEmailWorker({
                studentEmail: bill_to_email,
                amount,
                currency,
                studentId: student_id,
                paymentFor,
                programme,
                referenceNumber: reference_number,
                studentName: `${bill_to_forename} ${bill_to_surname}`,
                transactionDate: format(
                  new Date(signed_date_time),
                  "hh:mm aaa, dd-LL-yy, OOOO",
                  {
                    timeZone: "Asia/Colombo",
                  }
                ),
              });
              console.log(info);
              return this.responseServices.successResponse(res);
            } catch (err) {
              console.log(err);
              return this.responseServices.internalServerError(res);
            }
          }

          return this.responseServices.unProcessableEntity(
            res,
            "Payment data does not exist or has been processed previously!"
          );
        }
      );
    } catch (err) {
      console.error(err);
      return this.responseServices.internalServerError(
        res,
        undefined,
        process.env.NODE_ENV == "dev" ? err : {}
      );
    }
  }
}
