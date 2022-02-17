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

const GET_AVAILABILITIES = gql`
  query {
    properties(
      query: {
        partnerExternalRefs: { partner: "GMAH", externalIds: ["61102"] }
      }
      first: 100
    ) {
      edges {
        node {
          id
          name
          country
          url
          photos
          rooms(
            startDate: "2022-02-17"
            endDate: "2022-02-20"
            adults: 2
            children: [5, 1]
            first: 100
          ) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`;

export default function getAvailabilities(ctx: Context) {
  client
    .query({
      query: GET_AVAILABILITIES,
    })
    .then((result: any) => {
      logger.info(result.data);
      ctx.body = result.data;
    })
    .catch((error: any) => {
      logger.error(error);
      ctx.body = error;
    });
  ctx.status = 200;
}
