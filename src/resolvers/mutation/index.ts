import GMR from 'graphql-merge-resolvers';
import resolverUserMutation from './user';
import resolverGenreMutation from './genre';
import resolverTagMutation from './tag';
import resolverMailMutation from './email';

const mutationResolvers = GMR.merge([
    resolverUserMutation,
    resolverGenreMutation,
    resolverTagMutation,
    resolverMailMutation
]);

export default mutationResolvers;