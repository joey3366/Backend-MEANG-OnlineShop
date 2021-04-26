import GMR from 'graphql-merge-resolvers';
import resolversPlatformType from './platforms';
import resolversProductType from './product';
import resolversShopProductType from './shop-product';
import typeStripeResolvers from './stripe';

const typeResolvers = GMR.merge([
    resolversShopProductType,
    resolversPlatformType,
    resolversProductType,
    typeStripeResolvers
]);

export default typeResolvers;