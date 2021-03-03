import { IResolvers } from 'graphql-tools';
import GenresService from '../../services/genre.service';

const resolverGenreMutation: IResolvers ={
    Mutation:{
        addGenre(_, variables, context){
            return new GenresService(_, variables, context).insert();
        },

        updateGenre(_, variables, context){
            return new GenresService(_, variables, context).modify();
        },

        deleteGenre(_, variables, context){
            return new GenresService(_, variables, context).delete();
        }
    }
};

export default resolverGenreMutation;