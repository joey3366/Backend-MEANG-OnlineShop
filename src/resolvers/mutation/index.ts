import GMR from 'graphql-merge-resolvers';
import resolverUserMutation from './user';
import resolverGenreMutation from './genre';
import resolverTagMutation from './tag';
import resolverMailMutation from './email';
import mutationStripeResolvers from './stripe';
import resolverShopProductMutation from './shop-product';

const mutationResolvers = GMR.merge([
    resolverUserMutation,
    resolverGenreMutation,
    resolverTagMutation,
    resolverMailMutation,
    mutationStripeResolvers,
    resolverShopProductMutation
]);

export default mutationResolvers;