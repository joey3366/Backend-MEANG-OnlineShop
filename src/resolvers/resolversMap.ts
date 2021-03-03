import { IResolvers } from 'graphql-tools';
import mutations from './mutation';
import query from './query';

const resolversMap: IResolvers = {
    ...query,
    ...mutations
};

export default resolversMap;