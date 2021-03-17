import bcrypt from "bcrypt";
import { COLLECTIONS, EXPIRETIME } from "../config/constants";
import { findOneElement } from "../lib/db-operations";
import Jwt from "../lib/jwt";
import { IContextData } from "./../interfaces/context-data.interface";
import MailService from "./mail.service";
import ResolversOperationsService from "./resolvers-operations.service";

class PasswordService extends ResolversOperationsService {
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  async sendMail() {
    const email = this.getVariables().user?.email || "";
    if (email === undefined || email === "") {
      return {
        status: false,
        message: "Email No definido correctamente",
      };
    }
    const user = await findOneElement(this.getDb(), COLLECTIONS.USERS, {
      email,
    });
    if (user === undefined || user === null) {
      return {
        status: false,
        message: `Usuario con el email ${email} no existe`,
      };
    }
    const newUser = { id: user.id, email };
    const token = new Jwt().sign({ user: newUser }, EXPIRETIME.M15);
    const html = `Para cambiar tu contraseña haz clic aca <a href="${process.env.CLIENT_URL}/#/reset/${token}"> Clic aca </a>`;
    const mail = { to: email, subject: "Cambio de contraseña", html };
    return new MailService().send(mail);
  }

  async change() {
    const id = this.getVariables().user?.id;
    let password = this.getVariables().user?.password;
    if (id === undefined || id === "") {
      return {
        status: false,
        message: "Id no existe",
      };
    }
    if (password === undefined || password === "" || password === "123456") {
      return {
        status: false,
        message: "Password no existe",
      };
    }
    password = bcrypt.hashSync(password, 12);
    const result = await this.update(COLLECTIONS.USERS, { id }, { password }, 'users');
    return{
        status: result.status,
        message: (result.status)? 'Contraseña cambiada correctamente' : result.message
    }
  }
}

export default PasswordService;
