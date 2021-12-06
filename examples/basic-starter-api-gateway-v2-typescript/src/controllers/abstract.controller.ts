import { Request, Response } from "express";
import { ResponseServices } from "../models/common/services/response_services.service";
import { referencesService } from "../models/references/services/refrences.service";
import {DateService} from "../models/common/services/date.service"


export class AbstractControllClass{
    protected responseServices : ResponseServices = new ResponseServices();
    protected referenceService : referencesService = new referencesService();
    protected dateService : DateService = new DateService ();
    
    public insertData (req : Request, res : Response){}

    public updateData (req : Request, res : Response){}

    public deleteData (req : Request, res : Response){}

    public getAllData (req : Request, res : Response){}

    public getOneData (req : Request, res : Response){}

    protected objectCreateFunction (keys_of_interface : any,object : any, req_body : any, type:any){

        Object.keys(req_body).filter((key : string)=>
        keys_of_interface.includes(key) && req_body[key] !== null && req_body[key] !== undefined)
        .map((key_1 : string)=> 
        key_1).forEach((key_2 : string)=>{
        Object.assign(object , {[key_2] : req_body[key_2]})
        });
          
        return <typeof type>object ;
    }
}