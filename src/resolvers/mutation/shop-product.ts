import { IResolvers } from 'graphql-tools';
import ShopProductsService from '../../services/shop-product.service';
import TagService from '../../services/tag.service';

const resolverShopProductMutation: IResolvers ={
    Mutation:{
        updateStock(_, { update }, { db }){
            return new ShopProductsService(_,{},{ db }).updateStock(update)
        }
    }
};

export default resolverShopProductMutation;