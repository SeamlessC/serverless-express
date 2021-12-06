import { CallbackError, Document, Error, model } from "mongoose";
import { IReferences } from "../model/reference.model";
import references from "../scheme/reference.scheme";

export class referencesService {
  public addMultiReferences(
    refs: Array<IReferences>,
    callback: (err: Error, data: Document) => void
  ) {
    references.insertMany(refs);
  }
  public addReference(
    ref_params: IReferences,
    callback: (err: CallbackError, data: Document) => void
  ) {
    const ref = new references(ref_params);
    ref.save(callback);
  }

  public getReference(
    filter: any,
    callback: (err: CallbackError, data: IReferences[]) => void
  ) {
    references
      .aggregate([
        {
          $match: filter,
        },
        {
          $project: {
            _v: 0,
          },
        },
      ])
      .exec(callback);
  }
  public async getReferenceAsync(
    filter: any,
    callback?: (err: CallbackError, data: IReferences[]) => void
  ) {
    const value: IReferences[] = await references
      .aggregate([
        {
          $match: filter,
        },
        {
          $project: {
            _v: 0,
          },
        },
      ])
      .exec();
    return value;
  }
}
