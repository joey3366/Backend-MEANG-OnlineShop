import { IResolvers } from 'graphql-tools';
import TagService from '../../services/tag.service';

const resolverTagMutation: IResolvers ={
    Mutation:{
        addTag(_, variables, context){
            return new TagService(_, variables, context).insert();
        },

        updateTag(_, variables, context){
            return new TagService(_, variables, context).modify();
        },

        deleteTag(_, variables, context){
            return new TagService(_, variables, context).delete();
        },

        blockTag(_, {id, unblock}, context){
            return new TagService(_, { id }, context).unblock(unblock);
        }
    }
};

export default resolverTagMutation;