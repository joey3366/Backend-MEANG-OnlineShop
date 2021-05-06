import { IResolvers } from 'graphql-tools';
import mutations from './mutation';
import query from './query';
import type from './type';
import subscription from './subscription';

const resolversMap: IResolvers = {
    ...query,
    ...mutations,
    ...type,
    ...subscription
};

export default resolversMap;