import { Db } from 'mongodb';

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
    return 1;
  } return lastElement[0].id + 1;
};

export const findOneElement = async (
    database: Db,
    collection: string,
    filter: object
) =>{
    return await database.collection(collection)
    .findOne(filter);
};

export const insertOneElement = async (
    database: Db,
    collection: string,
    document: object
) => {
    database.collection(collection).insertOne(document);
};

export const findElements = async (
    database: Db,
    collection: string,
    filter: object
) => {
    return await database.collection(collection).find().toArray();
};
