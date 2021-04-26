import GMR from 'graphql-merge-resolvers';
import resolversStripeCardQuery from './card';
import resolversStripeCustomerQuery from './customers';

const queryStripeResolvers = GMR.merge([
    resolversStripeCustomerQuery,
    resolversStripeCardQuery
]);

export default queryStripeResolvers;