import { CallbackError, Error } from "mongoose";
import counters from "../scheme/counter.scheme";

export class CounterService {
  public findAndUpdateCounter(
    filter: any,
    callback: (err: CallbackError, data: any) => void
  ) {
    const update = { $inc: { count_number: 1 } };
    counters
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      })
      .exec(callback);
  }
}
