import { Application } from "express";
import { PaymentRoute } from "./payment.routes";
import { ReferenceRoute } from "./reference.routes";

export class IndexRoutes {
  private paymentRoute: PaymentRoute = new PaymentRoute();
  private referenceRoute: ReferenceRoute = new ReferenceRoute();

  public route(app: Application) {
    this.paymentRoute.route(app);
    this.referenceRoute.route(app);
  }
}
