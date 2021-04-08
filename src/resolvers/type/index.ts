import GMR from 'graphql-merge-resolvers';
import resolversPlatformType from './platforms';
import resolversProductType from './product';
import resolversShopProductType from './shop-product';

const typeResolvers = GMR.merge([
    resolversShopProductType,
    resolversPlatformType,
    resolversProductType
]);

export default typeResolvers;