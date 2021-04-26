import GMR from 'graphql-merge-resolvers';
import resolversGenreQuery from './genre';
import resolversShopProductsQuery from './shop-product';
import queryStripeResolvers from './stripe';
import resolversTagQuery from './tag';
import resolversUserQuery from './user';

const queryResolvers = GMR.merge([
    resolversUserQuery,
    resolversGenreQuery,
    resolversTagQuery,
    resolversShopProductsQuery,
    queryStripeResolvers
]);

export default queryResolvers;