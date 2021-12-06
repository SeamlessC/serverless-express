import { connect, set, connection } from "mongoose";

export class MongoConnection {
  public connect(): void {
    const mongoDB = process.env.mongodb as string;

    connect(mongoDB);

    const db = connection;

    db.on("error", console.error.bind(console, "MongoDB connection error:"));
  }
}
