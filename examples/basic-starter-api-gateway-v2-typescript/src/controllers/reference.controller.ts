import { Request, Response } from "express";
import { CallbackError, Document, Error } from "mongoose";
import { SERVER_ERROR_MESSAGE_CREATE } from "../models/common/constants/constant";
import { addReferenceType, DefaultReferenceObj, IReferences , IReferenceType } from "../models/references/model/reference.model";
import { AbstractControllClass } from "./abstract.controller";

export class ReferenceController extends AbstractControllClass {
    insertData(req: Request, res: Response) {
        addReferenceType.validate(req.body)
            .then((valid:any) => {
                if (valid) {
                    req.body.is_deleted = false;
                    const reference: IReferences = this.objectCreateFunction(Object.keys(IReferenceType.fields) ,DefaultReferenceObj, req.body , IReferenceType)
                    this.referenceService.addReference(reference, (errCreateRef: CallbackError, data: Document) => {
                        if (errCreateRef) {
                            this.responseServices.internalServerError(res, SERVER_ERROR_MESSAGE_CREATE, errCreateRef);
                        } else {
                            this.responseServices.successResponse(res)
                        }
                    });
                }
            }).catch((errors:any) => {
                this.responseServices.insufficientParametersResponse(res, errors);
            });
    }
}