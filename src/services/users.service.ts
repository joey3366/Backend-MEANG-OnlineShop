import { ACTIVE_VALUES_FILTER } from './../config/constants';
import { COLLECTIONS, EXPIRETIME, MESSAGES } from "../config/constants";
import { IContextData } from "../interfaces/context-data.interface";
import {
  asignDocumentId,
  findOneElement,
  insertOneElement,
} from "../lib/db-operations";
import Jwt from "../lib/jwt";
import ResolversOperationsService from "./resolvers-operations.service";
import bcrypt from "bcrypt";
import MailService from "./mail.service";

class UsersService extends ResolversOperationsService {
  private collection = COLLECTIONS.USERS;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }

  // Lista De Usuarios
  async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE) {
    let filter: object = {active : {$ne: false}}
    if (active === ACTIVE_VALUES_FILTER.ALL) {
      filter = {}
    }else if(active === ACTIVE_VALUES_FILTER.INACTIVE){
      filter = { active: false}
    }
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(
      this.collection,
      "usuarios",
      page,
      itemsPage,
      filter
    );
    return {
      status: result.status,
      message: result.message,
      users: result.items,
      info: result.info,
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
          ? "Usuario o contraseña incorrectos"
          : "Login Correcto",
        token: !passwordCheck ? null : new Jwt().sign({ user }),
        user: !passwordCheck ? null : user,
      };
    } catch (error) {
      console.log(error);
      return {
        status: false,
        message: "Datos No Se Pudieron Cargar Correctamente",
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
      message: "Usuario Autenticado Correctamente",
      user: Object.values(info)[0],
    };
  }

  //Registro De Usuario
  async register() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: "Usuario No definido",
        user: null,
      };
    }
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ""
    ) {
      return {
        status: false,
        message: "Usuario sin contraseña definida",
        user: null,
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
    const result = await this.add(this.collection, user || {}, "usuario");
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }

  // Actualizar Usuario
  async modify() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: "Usuario No definido",
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(
      this.collection,
      filter,
      user || {},
      "usuario"
    );
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }

  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === "") {
      return {
        status: false,
        message: "ID no definida",
        user: null,
      };
    }
    const result = await this.del(this.collection, { id }, "usuario");
    return {
      status: result.status,
      message: result.message,
    };
  }

  async unBlock(unblock: boolean, admin: boolean) {
    const id = this.getVariables().id;
    const user = this.getVariables().user;
    if (!this.checkData(String(id) || "")) {
      return {
        status: false,
        message: "El id del usuario no se ha especificado correctamente",
        genre: null,
      };
    }
    if (user?.password === "123456") {
      return {
        status: false,
        message: "No se puede activar ya que no se ha cambiando la contraseña",
      };
    }
    let update = { active: unblock };
    if (unblock && !admin) {
      update = Object.assign(
        {},
        { active: true },
        {
          birthday: user?.birthDay,
          password: bcrypt.hashSync(user?.password, 12),
        }
      );
    }
    const result = await this.update(
      this.collection,
      { id },
      update,
      "usuario"
    );
    const action = (unblock) ? "Desbloqueado" : "Bloqueado";
    return {
      status: result.status,
      message: `${action} correctamente`,
    };
  }

  async active(){
    const id = this.getVariables().user?.id
    const email = this.getVariables().user?.email || '';
    if (email === undefined || email === '') {
      return {
        status: false,
        message: 'Email No definido correctamente'
      }
    }
    const token = new Jwt().sign({ user: { id, email } }, EXPIRETIME.H1);
    const html = `Para activar tu usuario haz clic aca <a href="${process.env.CLIENT_URL}/#/active/${token}"> Clic aca </a>`;
    const mail = {to: email, subject: 'Activar Usuario', html}
    return new MailService().send(mail)
  }

  private checkData(value: string) {
    return value === "" || value === undefined ? false : true;
  }
}

export default UsersService;
