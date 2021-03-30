import GMR from 'graphql-merge-resolvers';
import resolversPlatformType from './platforms';
import resolversShopProductType from './shop-product';

const typeResolvers = GMR.merge([
    resolversShopProductType,
    resolversPlatformType
]);

export default typeResolvers;