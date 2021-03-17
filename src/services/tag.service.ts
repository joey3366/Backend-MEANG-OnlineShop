import slugify from "slugify";
import { COLLECTIONS } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import { asignDocumentId, findOneElement } from "../lib/db-operations";
import ResolversOperationsService from "./resolvers-operations.service";

class TagService extends ResolversOperationsService {
  collection = COLLECTIONS.TAGS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, "tags", page, itemsPage);
    return {
      status: result.status,
      message: result.message,
      tags: result.items,
      info: result.info,
    };
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      tag: result.item,
    };
  }

  async insert() {
    const tag = this.getVariables().tag;
    if (!this.checkData(tag || '')) {
      return {
        status: false,
        message: 'El tag no se ha especificado correctamente',
        tag: null,
      };
    }
    if (await this.checkInDatabase(tag || '')) {
      return {
        status: false,
        message: `El tag '${tag}' ya existe`,
        tag: null,
      };
    }
    const tagObject = {
      id: await asignDocumentId(this.getDb(), this.collection, { id: -1 }),
      name: tag,
      slug: slugify(tag || '', { lower: true }),
    };
    const result = await this.add(this.collection, tagObject, 'tag');
    return {
      status: result.status,
      message: result.message,
      tag: result.item,
    };
  }

  async modify() {
    const id = this.getVariables().id;
    const tag = this.getVariables().tag;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El id del tag no se ha especificado correctamente',
        tag: null,
      };
    }
    if (!this.checkData(tag || '')) {
      return {
        status: false,
        message: 'El género no se ha especificado correctamente',
        tag: null,
      };
    }
    const objectUpdate = {
      name: tag,
      slug: slugify(tag || '', { lower: true }),
    };
    const result = await this.update(
      this.collection,
      { id },
      objectUpdate,
      'tag'
    );
    return {
      status: result.status,
      message: result.message,
      tag: result.item,
    };
  }

  async delete(){
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El id del tag no se ha especificado correctamente',
        tag: null,
      };
    }
    const result = await this.del(this.collection, { id }, 'tag');
    return {
      status: result.status,
      message: result.message
    };
  }

  async block(){
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El id del tag no se ha especificado correctamente',
        tag: null,
      };
    }
    const result = await this.update(this.collection, {id}, {active: false}, 'tag');
    return{
      status: result.status,
      message: (result.status)?'Bloqueado':'No se ha bloqueado'
    }
  }



  private checkData(value: string) {
    return value === '' || value === undefined ? false : true;
  }

  private async checkInDatabase(value: string) {
    return await findOneElement(this.getDb(), this.collection, { name: value });
  }
}

export default TagService;
