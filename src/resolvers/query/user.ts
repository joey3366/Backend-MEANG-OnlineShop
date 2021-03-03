import { findOneElement, findElements } from './../../lib/db-operations';
import { COLLECTIONS, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import Jwt from './../../lib/jwt';
import bcrypt from 'bcrypt';
import UsersService from '../../services/users.service';
const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, context) {
      return new UsersService(_, __, context).items();
    },
    async login(_, { email, password }, context) {
      return new UsersService(_, { user: { email, password}}, context).login();
    },
    me(_,__, { token }){
      return new UsersService(_, __, { token }).auth();
    }
  },
};

export default resolversUserQuery;