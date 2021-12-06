export enum response_statuses {
  success = 200,
  unauthorized = 401,
  forbidden = 403,
  token_expired_error = 419,
  un_processable_entity = 422,
  login_expired_error = 440,
  token_still_valid_error = 441,
  connection_key_error = 498,
  internal_server_error = 500,
  gateway_timeout_error = 504,
}
export enum references_types {
  programme_type = "programme_type",
  payment_type = "payment_type",
}
export interface modification_note {
  modified_by: String;
  modified_on: Date;
  modified_note: String;
}

export enum currency_types {
  LKR = "LKR",
  USD = "USD",
}

export enum STATES {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  FAILURE = "FAILURE",
}
