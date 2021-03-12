import { Db } from "mongodb";
import { IVariables } from "./../interfaces/variables.interface";
import {
  findOneElement,
  insertOneElement,
  updateOneElement,
  deleteOneElement,
} from "./../lib/db-operations";
import { IContextData } from "./../interfaces/context-data.interface";
import { findElements } from "../lib/db-operations";
import { pagination } from "../lib/pagination";

class ResolversOperationsService {
  private variables: IVariables;
  private context: IContextData;

  constructor(root: object, variables: IVariables, context: IContextData) {
    this.variables = variables;
    this.context = context;
  }

  //Listar Elementos
  protected async list(
    collection: string,
    listElements: string,
    page: number = 1,
    itemsPage: number = 20,
    filter: object = {active: {$ne: false}}
  ) {
    try {
      const paginationData = await pagination(
        this.getDb(),
        collection,
        page,
        itemsPage,
        filter
      );
      return {
        status: true,
        message: `Lista de ${listElements} cargada correctamente`,
        items: await findElements(this.getDb(), collection, filter, paginationData),
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total,
        },
      };
    } catch (error) {
      return {
        status: false,
        message: `Lista no se pudo cargar ${error}`,
        items: null,
        info: null,
      };
    }
  }

  // Obtener detalles del item
  protected async get(collection: string) {
    const collectionLabel = collection.toLowerCase();
    try {
      return await findOneElement(this.getDb(), collection, {
        id: this.variables.id,
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `${collectionLabel} ha sido cargada correctamente`,
            item: result,
          };
        }
        return {
          status: true,
          message: `${collectionLabel} no ha obtenido detalles porque no existe`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `error inesperado al cargar los detalles de ${collectionLabel}`,
        item: null,
      };
    }
  }

  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(
        (res) => {
          if (res.result.ok) {
            return {
              status: true,
              message: `${item} añadido correctamente`,
              item: document,
            };
          }
          return {
            status: false,
            message: `${item} no se ha podido añadir. Intentalo nuevamente`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `${error} al insertar ${item}`,
        item: null,
      };
    }
  }

  protected async update(
    collection: string,
    filter: object,
    objectUpdate: object,
    item: string
  ) {
    try {
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then((res) => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `El elemento del ${item} fue actualizado correctamente`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: false,
          message: `El elemento del ${item} no se ha podido actualizar. Revisa los parametros`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Ha ocurrido un error ${error}`,
        item: null,
      };
    }
  }

  protected async del(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter).then(
        (res) => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `El ${item} fue eliminado correctamente`,
            };
          }
          return {
            status: false,
            message: `El ${item} No se ha podido eliminar`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Ha ocurrido un error: ${error}`,
      };
    }
  }

  protected getVariables(): IVariables {
    return this.variables;
  }

  protected getDb(): Db {
    return this.context.db!;
  }

  protected getContext(): IContextData {
    return this.context;
  }
}
export default ResolversOperationsService;
