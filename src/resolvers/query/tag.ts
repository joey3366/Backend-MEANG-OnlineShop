import { IResolvers } from 'graphql-tools';
import TagService from '../../services/tag.service';
const resolversTagQuery: IResolvers = {
    Query: {
        async tags(_, variables, { db }) {
        return new TagService(_, { pagination: variables },{ db }).items();
        },
        async tag(_, { id }, { db }) {
            return new TagService(_,{ id },{ db }).details();
        }
    }
};  
export default resolversTagQuery;