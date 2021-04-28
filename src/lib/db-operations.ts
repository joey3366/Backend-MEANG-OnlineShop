import { IPaginationOptions } from "./../interfaces/pagination-options.interface";
import { Db } from "mongodb";

// Asignar Id Dinamicamente
export const asignDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();

  if (lastElement.length === 0) {
    return "1";
  }
  return String(+lastElement[0].id + 1);
};

// Encontrar un solo elemento
export const findOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return await database.collection(collection).findOne(filter);
};

// Insertar un solo elemento
export const insertOneElement = async (
  database: Db,
  collection: string,
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

// Lista de elementos
export const findElements = async (
  database: Db,
  collection: string,
  filter: object = {},
  paginationOptions: IPaginationOptions = {
    page: 1,
    pages: 1,
    itemsPage: -1,
    skip: 0,
    total: -1,
  }
) => {
  if (paginationOptions.total === -1) {
    return await database.collection(collection).find(filter).toArray();
  }
  return await database
    .collection(collection)
    .find(filter)
    .limit(paginationOptions.itemsPage)
    .skip(paginationOptions.skip)
    .toArray();
};

// Actualizar elemento
export const updateOneElement = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object
) => {
  return await database
    .collection(collection)
    .updateOne(filter, { $set: updateObject });
};

//Eliminar elemmento
export const deleteOneElement = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).deleteOne(filter);
};

//Contar Elementos
export const countElements = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).countDocuments(filter);
};

export const randomItems = async (
  database: Db,
  collection: string,
  filter: object = {},
  items: number = 10
): Promise<Array<object>> => {
  return new Promise(async (resolve) => {
    const pipeline = [{ $match: filter }, { $sample: { size: items } }];
    resolve(
      await database.collection(collection).aggregate(pipeline).toArray()
    );
  });
};

export const manageStockUpdate = async (database: Db, collection: string, filter: object, updateObject: object) => {
  return await database.collection(collection).updateOne(filter, {$inc: updateObject})
}
