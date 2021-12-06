import { Application, Request, Response, NextFunction } from "express";
import { PaymentController } from "../controllers/payment.controller";

export class PaymentRoute {
  private paymentController: PaymentController = new PaymentController();

  public route(app: Application) {
    app.get("/", (req: Request, res: Response) =>
      res.send("Hi! Welcome to our Backend!")
    );

    app.post("/payments", (req: Request, res: Response) => {
      this.paymentController.insertData(req, res);
    });

    app.get("/transactions", (req: Request, res: Response) => {
      this.paymentController.getAllData(req, res);
    });
    app.post("/payment", (req: Request, res: Response) => {
      this.paymentController.getPayment(req, res);
    });

    app.post("/accept/payments", (req: Request, res: Response) => {
      this.paymentController.approvePayment(req, res);
    });
  }
}
