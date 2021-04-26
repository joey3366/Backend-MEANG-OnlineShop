import GMR from 'graphql-merge-resolvers';
import resolverUserMutation from './user';
import resolverGenreMutation from './genre';
import resolverTagMutation from './tag';
import resolverMailMutation from './email';
import mutationStripeResolvers from './stripe';

const mutationResolvers = GMR.merge([
    resolverUserMutation,
    resolverGenreMutation,
    resolverTagMutation,
    resolverMailMutation,
    mutationStripeResolvers
]);

export default mutationResolvers;