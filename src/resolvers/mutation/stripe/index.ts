import GMR from 'graphql-merge-resolvers';
import resolverStripeCardMutation from './card';
import resolverStripeChargeMutation from './charge';
import resolverStripeCustomerMutation from './customers';
const mutationStripeResolvers = GMR.merge([
    resolverStripeCustomerMutation,
    resolverStripeCardMutation,
    resolverStripeChargeMutation
]);

export default mutationStripeResolvers;