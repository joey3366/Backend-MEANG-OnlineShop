import { findOneElement, updateOneElement } from "./../../lib/db-operations";
import { EXPIRETIME, MESSAGES, COLLECTIONS } from "./../../config/constants";
import { IResolvers } from "graphql-tools";
import { transport } from "../../config/mailer";
import Jwt from "../../lib/jwt";
import UsersService from "../../services/users.service";
import bcrypt from 'bcrypt';
import MailService from "../../services/mail.service";
import PasswordService from "../../services/password.service";

const resolverMailMutation: IResolvers = {
  Mutation: {
    async sendEmail(_, { mail }) {
      return new MailService().send(mail)
    },
    async activeUserEmail(_, { id, email }) {
      return new UsersService(_,{user: { id, email }}, {}).active();
    },
    activeUserAction(_, { id, birthday, password }, { token, db }) {
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return{
          status: false,
          message: verify.message
        }
      }
      return new UsersService(
        _,
        { id, user: { birthday, password } },
        { token, db }
      ).unBlock(true);
    },
    async resetPassword(_, { email }, { db }) {
      return new PasswordService(_, { user: { email }}, {db}).sendMail();
    },

    async changePassword(_, { id, password }, { db, token }) {
      const verify = verifyToken(token, id);
      if (verify?.status === false) {
        return{
          status: false,
          message: verify.message
        }
      }
      return new PasswordService(_,{ user: { id, password }}, { db }).change();
    },
  },
};

function verifyToken(token: string, id: string) {
  const checkToken = new Jwt().verify(token);
  if (checkToken === MESSAGES.TOKEN_VERIFICATION_FAILED) {
    return {
      status: false,
      message: "Token incorrecto",
    };
  }
  const user = Object.values(checkToken)[0];
  if (user.id !== id) {
    return {
      status: false,
      message: "Id incorrecto",
    };
  }

  return{
    status: true,
    message: 'Token Correcto'
  }
}

export default resolverMailMutation;
