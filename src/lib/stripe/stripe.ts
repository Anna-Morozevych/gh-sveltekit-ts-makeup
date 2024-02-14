import Stripe from 'stripe';
import { variables } from '$lib/variebles';

export const stripe = new Stripe(variables.publicStripeKey, {
  apiVersion: "2023-10-16"
})