import GMR from 'graphql-merge-resolvers';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery
]);

export default queryResolvers;