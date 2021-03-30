import { IResolvers } from 'graphql-tools';
import TagService from '../../services/tag.service';
const resolversTagQuery: IResolvers = {
    Query: {
        async tags(_, { page, itemsPage, active}, { db }) {
        return new TagService(_, { pagination: { page, itemsPage}} ,{ db }).items(active);
        },
        async tag(_, { id }, { db }) {
            return new TagService(_,{ id },{ db }).details();
        }
    }
};  
export default resolversTagQuery;