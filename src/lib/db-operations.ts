import { Db } from 'mongodb';

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
    return '1';
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
  filter: object = {}
) => {
  return await database.collection(collection).find(filter).toArray();
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
