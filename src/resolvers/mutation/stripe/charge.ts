import { IResolvers } from "graphql-tools";
import StripeCardService from '../../../services/stripe/card.service';
import StripeChargeService from "../../../services/stripe/charge.service";

const resolverStripeChargeMutation: IResolvers = {
  Mutation: {
    async chargeOrder(_, { payment }) {
      return new StripeChargeService().order(payment);
    }
  },
};

export default resolverStripeChargeMutation;
