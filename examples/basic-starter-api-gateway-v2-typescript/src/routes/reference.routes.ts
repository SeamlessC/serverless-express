import { Application, Request, Response } from "express";
import { Document, Error } from "mongoose";
import { ReferenceController } from "../controllers/reference.controller";
import { SERVER_ERROR_MESSAGE_CREATE } from "../models/common/constants/constant";
import { ResponseServices } from "../models/common/services/response_services.service";
import { referencesService } from "../models/references/services/refrences.service";
import { IReferences } from "../models/references/model/reference.model";

export class ReferenceRoute {
  private referenceController: ReferenceController = new ReferenceController();
  referencesService = new referencesService();
  ResponseServices = new ResponseServices();
  public route(app: Application) {
    app.post("/reference", (req: Request, res: Response) => {
      this.referenceController.insertData(req, res);
    });
    app.post("/all_references", async (req: Request, res: Response) => {
      const refArray: Array<IReferences> = req.body.references.map(
        (reference: any) => {
          reference.is_deleted = false;
          return reference;
        }
      );
      const confirm = await this.referencesService.addMultiReferences(
        refArray,
        (err: Error, data: Document) => {
          console.error(err);
        }
      );
      res.send("done");
      // this.referenceController.insertData(req, res);
    });
  }
}
