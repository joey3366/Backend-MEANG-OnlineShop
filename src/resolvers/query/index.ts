import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversGenreQuery
]);

export default queryResolvers;