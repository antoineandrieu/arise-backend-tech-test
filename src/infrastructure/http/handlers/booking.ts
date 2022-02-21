import { Context } from "koa";
import {
  ApolloClient,
  HttpLink,
  gql,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client/core";
import fetch from "cross-fetch";
import logger from "../../../logger";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache({}),
  link: new HttpLink({ uri: process.env.GRAPHQL_ENDPOINT, fetch }),
});

const CREATE_BOOKING = gql`
  mutation ($payload: CreateReservationInput!) {
    createReservation(payload: $payload) {
      id
      checkIn
      checkOut
    }
  }
`;

export default async function postBooking(ctx: Context) {
  const { hotel_id, check_in, check_out, adults, children } = ctx.request.query;
  try {
    const result = await client.mutate({
      variables: {
        payload: {
          hotelId: "b463b8bb-76cf-46a9-b266-5ab5730b69ba",
          roomId: "cdf8f4f7-01c6-44a8-8441-18f79d6aa608",
          checkIn: "2022-02-17",
          checkOut: "2022-02-20",
          adults: 2,
          price: {
            amount: 9115,
            currency: "EUR",
            decimalPlaces: 2,
          },
        },
      },
      mutation: CREATE_BOOKING,
    });
    // @ts-ignore
    let data = result.data.createReservation;
    logger.info(data);
    ctx.status = 200;
    // @ts-ignore
    ctx.body = data;
  } catch (error) {
    logger.error(error);
    // @ts-ignore
    logger.error(error.networkError);
    // @ts-ignore
    ctx.body = error.networkError.result.errors;
    // @ts-ignore
    ctx.status = error.networkError.statusCode;
  }
}
