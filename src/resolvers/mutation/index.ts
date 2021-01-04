import GMR from 'graphql-merge-resolvers';
import resolverUserMutation from './user';

const mutationResolvers = GMR.merge([
    resolverUserMutation
]);

export default mutationResolvers;