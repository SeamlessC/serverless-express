import { ObjectId } from "mongodb";
import { Callback, CallbackError, Document, Error } from "mongoose";
import { IStudent } from "../model/student.model";
import students from "../scheme/student.scheme";

export class StudentService {
  public createOrUpdateStudent(
    filter: any,
    update: IStudent,
    callback: (err: CallbackError, data: any) => void
  ) {
    students
      .findOneAndUpdate(filter, update, {
        new: true,
        upsert: true,
      })
      .exec(callback);
  }
  public async getStudentById(id: string): Promise<IStudent> {
    const student: IStudent = await students.findOne({ student_id: id }).exec();
    return student;
  }
  public getStudents(
    filter: any,
    callback: (err: CallbackError, data: IStudent[]) => void
  ) {
    students
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
}
