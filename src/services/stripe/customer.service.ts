import { Db } from "mongodb";
import { COLLECTIONS } from "../../config/constants";
import { IStripeCustomer } from "../../interfaces/stripe/customer.interface";
import { IUser } from "../../interfaces/user.interface";
import { findOneElement } from "../../lib/db-operations";
import StripeApi, {
  STRIPE_ACTIONS,
  STRIPE_OBJECTS,
} from "../../lib/stripe-api";
import UsersService from "../users.service";

class StripeCustomerService extends StripeApi {
  // Cargar Todos los clientes
  async list(
    limit: number = 5,
    startingAfter: string = "",
    endingBefore: string = ""
  ) {
    const pagination = this.getPagination(startingAfter, endingBefore);
    return await new StripeApi()
      .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.LIST, {
        limit,
        ...pagination,
      })
      .then((result: { has_more: boolean; data: Array<IStripeCustomer> }) => {
        return {
          status: true,
          message: "Lista de usuarios cargada correctamente",
          hasMore: result.has_more,
          customers: result.data,
        };
      })
      .catch((error: Error) => this.getError(error));
  }

  //Cargar Un Solo Cliente
  async get(id: string) {
    return await new StripeApi()
      .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.GET, id)
      .then(async (result: IStripeCustomer) => {
        return {
          status: true,
          message: "Cliente cargado correctamente",
          customer: result,
        };
      })
      .catch((error: Error) => this.getError(error));
  }

  async add(name: string, email: string, db: Db) {
    const userCheckExist: {
      data: Array<IStripeCustomer>;
    } = await new StripeApi().execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTIONS.LIST,
      { email }
    );
    if (userCheckExist.data.length > 0) {
      return {
        status: false,
        message: "Usuario Ya existe",
      };
    }
    return new StripeApi()
      .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.CREATE, {
        name,
        email,
        description: `${name} (${email})`,
      })
      .then(async (result: IStripeCustomer) => {
        const user: IUser = await findOneElement(db, COLLECTIONS.USERS, {
          email,
        });
        if (user) {
          user.stripeCustomer = result.id;
          const resultUserOperation = await new UsersService(
            {},
            { user },
            { db }
          ).modify();
        }
        return {
          status: true,
          message: "Cliente creado correctamente",
          customer: result,
        };
      })
      .catch((error: Error) => this.getError(error));
  }

  async update(id: string, customer: IStripeCustomer) {
    return await new StripeApi()
      .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.UPDATE, id, customer)
      .then((result: IStripeCustomer) => {
        return {
          status: true,
          message: "Usuario actualizado correctamente",
          customer: result,
        };
      })
      .catch((error: Error) => this.getError(error));
  }

  async delete(id: string, db: Db) {
    return await new StripeApi()
      .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTIONS.DELETE, id)
      .then(async (result: { id: string; deleted: boolean }) => {
        if (result.deleted) {
          const resultOperation = await db
            .collection(COLLECTIONS.USERS)
            .updateOne(
              { stripeCustomer: result.id },
              { $unset: { stripeCustomer: result.id } }
            );
          return {
            status: result.deleted && resultOperation ? true : false,
            message:
              result.deleted && resultOperation
                ? "Usuario eliminado correctamente"
                : "Usuario no se pudo eliminar",
          };
        }
        return {
          status: false,
          message: "Usuario No Borrado",
        };
      })
      .catch((error: Error) => this.getError(error));
  }
}

export default StripeCustomerService;
