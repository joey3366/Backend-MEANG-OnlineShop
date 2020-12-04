import { COLLECTIONS, MESSAGES } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import Jwt from '../lib/jwt';
import bcrypt from 'bcrypt';
const queryResolvers: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: 'Datos Cargados Correctamente',
          users: await db.collection(COLLECTIONS.USERS).find().toArray(),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: 'Datos No Se Pudieron Cargar Correctamente',
          users: [],
        };
      }
    },
    async login(_, { email, password }, { db }) {
      try {
        const user = await db
          .collection(COLLECTIONS.USERS)
          .findOne({ email });
        if (user === null) {
          return {
            status: false,
            message: `El usuario no se encuentra registado`,
            token: null,
          };
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);
        if(passwordCheck !== null){
          delete user.password;
          delete user.birthDay;
          delete user.registerDate;
        }
        return {
          status: true,
          message:
            !passwordCheck
              ? 'Usuario o contraseña incorrectos'
              : 'Login Correcto',
          token: 
            !passwordCheck
              ? null
              : new Jwt().sign({ user })
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message: 'Datos No Se Pudieron Cargar Correctamente',
          user: null,
        };
      }
    },
    me(_,__, { token }){
      let info = new Jwt().verify(token);
      if (info === MESSAGES.TOKEN_VERIFICATION_FAILED) {
        return {
          status: false,
          message : info,
          user: null
        };
      }
      return{
        status: true,
        message: 'Usuario Autenticado Correctamente',
        user: Object.values(info)[0]
      };
    }
  },
};

export default queryResolvers;
