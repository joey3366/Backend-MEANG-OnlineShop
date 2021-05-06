import { PubSub } from "apollo-server-express";
import { Db } from "mongodb";
import { IStock } from "../../interfaces/stock.interface";
import { IStripeCharge } from "../../interfaces/stripe/charge.interface";
import { IPayment } from "../../interfaces/stripe/payment.interface";
import StripeApi, {
  STRIPE_ACTIONS,
  STRIPE_OBJECTS,
} from "../../lib/stripe-api";
import StripeCardService from "./card.service";
import StripeCustomerService from "./customer.service";
import ShopProductsService from "../shop-product.service";

class StripeChargeService extends StripeApi {
  async order(
    payment: IPayment,
    stockChange: Array<IStock>,
    pubsub: PubSub,
    db: Db
  ) {
    const userData = await this.getClient(payment.customer);
    if (userData && userData.status) {
      if (payment.token !== undefined) {
        const cardCreate = await new StripeCardService().create(
          payment.customer,
          payment.token
        );
        await new StripeCustomerService().update(payment.customer, {
          default_source: cardCreate.card?.id,
        });
        await new StripeCardService().removeOtherCards(
          payment.customer,
          cardCreate.card?.id || ""
        );
      } else if (
        payment.token === undefined &&
        userData.customer?.default_source === null
      ) {
        return {
          status: false,
          message:
            "El cliente no tiene ningún método de pago asignado y no se puede realizar pago",
        };
      }
    } else {
      return {
        status: false,
        message: "El cliente no encontrado y no se puede realizar pago",
      };
    }
    delete payment.token;
    payment.amount = Math.round((+payment.amount + Number.EPSILON) * 100) / 100;
    payment.amount *= 100;
    return await this.execute(
      STRIPE_OBJECTS.CHARGES,
      STRIPE_ACTIONS.CREATE,
      payment
    )
      .then((result: object) => {
        new ShopProductsService({}, {}, { db }).updateStock(
          stockChange,
          pubsub
        );
        return {
          status: true,
          message: "Pago realizado correctamente",
          charge: result,
        };
      })
      .catch((error: Error) => this.getError(error));
  }

  private async getClient(customer: string) {
    return new StripeCustomerService().get(customer);
  }

  async listByCustomer(
    customer: string,
    limit: number,
    startingAfter: string,
    endingBefore: string
  ) {
    const pagination = this.getPagination(startingAfter, endingBefore);
    return this.execute(STRIPE_OBJECTS.CHARGES, STRIPE_ACTIONS.LIST, {
      limit,
      customer,
      ...pagination,
    })
      .then((result: { has_more: boolean; data: Array<IStripeCharge> }) => {
        return {
          status: true,
          message: "Lista de pagos cargada correctamente",
          hasMore: result.has_more,
          charges: result.data,
        };
      })
      .catch((error: Error) => this.getError(error));
  }
}

export default StripeChargeService;
