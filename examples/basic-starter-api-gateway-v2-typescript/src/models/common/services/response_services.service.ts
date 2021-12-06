import { Response } from "express";
import { Error } from "mongoose";
import {
  INVALID_OR_INSUFFICIENT_PARAMETERS,
  SUCCESS,
} from "../constants/constant";
import { response_statuses } from "../constants/enum";

export class ResponseServices {
  public successResponse(res: Response, data: any = null) {
    const response_body = {
      MESSAGE: SUCCESS,
      DATA: data,
    };
    console.log(SUCCESS);
    res.status(response_statuses.success).json(response_body);
  }

  public Forbidden(res: Response, err: any = null) {
    const error = {
      MESSAGE: "Payment data verification failed!",
    };
    console.error(error);
    res.status(response_statuses.forbidden).json(error);
  }
  public NotAcceptable(res: Response, err: any = null, reference?: string) {
    const error = {
      MESSAGE: "Payment refused by the payment provider!",
      reference: reference || undefined,
    };
    console.error(error);
    res.status(406).json(error);
  }
  public insufficientParametersResponse(res: Response, err: any = null) {
    const error = {
      MESSAGE: INVALID_OR_INSUFFICIENT_PARAMETERS,
      ERROR: err,
    };
    console.error(error);
    res.status(400).json(error);
  }

  public internalServerError(res: Response, error_message?: string, err?: any) {
    const error = {
      MESSAGE: "Internal Server Error! Please contact the administrator!",
      ERROR: err,
    };
    console.error(error);
    res.status(response_statuses.internal_server_error).json(error);
  }

  public unProcessableEntity(res: Response, error_message?: string) {
    const error = {
      MESSAGE:
        error_message ||
        "Data processing error occurred! Please contact the administrator",
    };
    console.error(error);
    res.status(response_statuses.un_processable_entity).json(error);
  }
  public NotFound(res: Response) {
    const error = {
      MESSAGE: "Payment information doesn't exist or still pending!",
    };
    console.error(error);
    res.status(404).json(error);
  }
}
