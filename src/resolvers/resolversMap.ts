import { IResolvers } from 'graphql-tools';
import mutations from './mutation';
import query from './query';
import type from './type';

const resolversMap: IResolvers = {
    ...query,
    ...mutations,
    ...type
};

export default resolversMap;