import { IResolvers } from 'graphql-tools';
import mutations from './mutations';
import query from './query';

const resolversMap: IResolvers = {
    ...query,
    ...mutations
};

export default resolversMap;