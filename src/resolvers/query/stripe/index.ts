import GMR from 'graphql-merge-resolvers';
import resolversStripeCardQuery from './card';
import resolversStripeChargeQuery from './charge';
import resolversStripeCustomerQuery from './customers';

const queryStripeResolvers = GMR.merge([
    resolversStripeCustomerQuery,
    resolversStripeCardQuery,
    resolversStripeChargeQuery
]);

export default queryStripeResolvers;