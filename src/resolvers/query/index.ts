import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversGenreQuery,
    resolversTagQuery
]);

export default queryResolvers;