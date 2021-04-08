import { randomItems } from "./../lib/db-operations";
import { IContextData } from "../interfaces/context-data.interface";
import { ACTIVE_VALUES_FILTER, COLLECTIONS } from "./../config/constants";
import ResolversOperationsService from "./resolvers-operations.service";

class ShopProductsService extends ResolversOperationsService {
  collection = COLLECTIONS.SHOP_PRODUCT;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  async items(
    active: string = ACTIVE_VALUES_FILTER.ACTIVE,
    platform: Array<string> = ["-1"],
    random: boolean = false,
    otherFilters: object = {}
  ) {
    let filter: object = { active: { $ne: false } };
    if (active === ACTIVE_VALUES_FILTER.ALL) {
      filter = {};
    } else if (active === ACTIVE_VALUES_FILTER.INACTIVE) {
      filter = { active: false };
    }
    if (platform[0] !== "-1" && platform !== undefined) {
      filter = { ...filter, ...{ platform_id: { $in: platform } } };
    }
    if (otherFilters !== {} && otherFilters !== undefined) {
      filter = { ...filter, ...otherFilters };
    }
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    if (!random) {
      const result = await this.list(
        this.collection,
        "Productos de la tienda",
        page,
        itemsPage,
        filter
      );
      return {
        info: result.info,
        status: result.status,
        message: result.message,
        shopProducts: result.items,
      };
    }
    const result: Array<object> = await randomItems(
      this.getDb(),
      this.collection,
      filter,
      itemsPage
    );
    if (result.length === 0 || result.length !== itemsPage) {
      return {
        info: { page: 1, pages: 1, itemsPage, total: 0 },
        status: false,
        message: "No se pudo cargar correctamente",
        shopProducts: [],
      };
    }
    return {
      info: { page: 1, pages: 1, itemsPage, total: itemsPage },
      status: true,
      message: "Datos Cargados correctamente",
      shopProducts: result,
    };
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      shopProduct: result.item,
    };
  }
}

export default ShopProductsService;
