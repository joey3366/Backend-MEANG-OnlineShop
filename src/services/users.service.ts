import { COLLECTIONS, MESSAGES } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import {
  asignDocumentId,
  findOneElement,
  insertOneElement,
} from '../lib/db-operations';
import Jwt from '../lib/jwt';
import ResolversOperationsService from './resolvers-operations.service';
import bcrypt from 'bcrypt';

class UsersService extends ResolversOperationsService {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // Lista De Usuarios
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, 'usuarios', page, itemsPage);
    return {
      status: result.status,
      message: result.message,
      users: result.items,
      info: result.info
    };
  }

  //Login De Usuarios
  async login() {
    try {
      const variables = this.getVariables().user;
      const user = await findOneElement(this.getDb(), this.collection, {
        email: variables?.email,
      });
      if (user === null) {
        return {
          status: false,
          message: `El usuario no se encuentra registado`,
          token: null,
        };
      }
      const passwordCheck = bcrypt.compareSync(
        variables?.password,
        user.password
      );
      if (passwordCheck !== null) {
        delete user.password;
        delete user.birthDay;
        delete user.registerDate;
      }
      return {
        status: passwordCheck,
        message: !passwordCheck
          ? 'Usuario o contraseña incorrectos'
          : 'Login Correcto',
        token: !passwordCheck ? null : new Jwt().sign({ user }),
        user: !passwordCheck ? null : user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: 'Datos No Se Pudieron Cargar Correctamente',
        user: null,
      };
    }
  }

  //Autenticacion De Usuario
  async auth() {
    let info = new Jwt().verify(this.getContext().token!);
    if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
      return {
        status: false,
        message: info,
        user: null,
      };
    }
    return {
      status: true,
      message: 'Usuario Autenticado Correctamente',
      user: Object.values(info)[0],
    };
  }

  //Registro De Usuario
  async register() {
    const user = this.getVariables().user;
    if (user === null) {
        return {
          status: false,
          message: 'Usuario No definido',
          user: null
        };
    }
    if (user?.password === null || user?.password === undefined || user?.password === '') {
      return{
        status: false,
        message: 'Usuario sin contraseña definida',
        user: null
      };
    }
    // Comprobar que el usuario no exista
    const userChek = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });

    if (userChek !== null) {
      return {
        status: false,
        message: `El usuario ${user?.email} ya se encuentra registrado`,
        user: null,
      };
    }
    // Comprobar el ultimo usuario registrado

    user!.id = await asignDocumentId(this.getDb(), this.collection, {
      registerDate: -1,
    });

    //Asignar fecha de registro
    user!.registerDate = new Date().toISOString();
    user!.password = bcrypt.hashSync(user!.password, 12);

    //Guardar datos
    const result = await this.add(this.collection, user || {}, 'usuario');
    return{
        status: result.status,
        message: result.message,
        user: result.item
    };
  }

  // Actualizar Usuario
  async modify(){
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: 'Usuario No definido',
        user: null
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(this.collection, filter, user || {}, 'usuario');
    return{
      status: result.status,
      message: result.message,
      user: result.item
    };
  }

  async delete(){
    const id = this.getVariables().id;
    if (id === undefined || id === '') {
      return{
        status: false,
        message: 'ID no definida',
        user: null
      };
    }
    const result = await this.del(this.collection, { id }, 'usuario');
    return {
      status: result.status,
      message: result.message
    };
  }
}

export default UsersService;
