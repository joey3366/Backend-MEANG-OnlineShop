import GMR from 'graphql-merge-resolvers';
import resolverUserMutation from './user';
import resolverGenreMutation from './genre';

const mutationResolvers = GMR.merge([
    resolverUserMutation,
    resolverGenreMutation
]);

export default mutationResolvers;