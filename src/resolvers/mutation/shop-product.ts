import { IResolvers } from 'graphql-tools';
import ShopProductsService from '../../services/shop-product.service';

const resolverShopProductMutation: IResolvers ={
    Mutation:{
        updateStock(_, { update }, { db, pubsub }){
            return new ShopProductsService(_,{},{ db }).updateStock(update, pubsub)
        }
    }
};

export default resolverShopProductMutation;