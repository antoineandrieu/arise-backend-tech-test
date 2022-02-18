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

const GET_PRODUCTS_BY_ID = gql`
  query test($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        images(first: 1) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        metafield(namespace: "scircula", key: "inDb") {
          value
        }
      }
    }
  }
`;

const GET_AVAILABILITIES = gql`
  query (
    $partnerExternalRefs: PartnerExternalRefsInput!
    $startDate: String!
    $endDate: String!
    $adults: Int!
    $children: [Int!]!
  ) {
    properties(
      query: { partnerExternalRefs: $partnerExternalRefs }
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
            startDate: $startDate
            endDate: $endDate
            adults: $adults
            children: $children
            first: 100
          ) {
            edges {
              node {
                id
                name
                description
                photos {
                  url
                }
                price {
                  amount
                  currency
                  decimalPlaces
                }
              }
            }
          }
        }
      }
    }
  }
`;

export default async function getAvailabilities(ctx: Context) {
  const { hotel_id, check_in, check_out, adults, children } = ctx.request.query;
  try {
    const result = await client.query({
      variables: {
        partnerExternalRefs: { partner: "GMAH", externalIds: hotel_id },
        startDate: check_in,
        endDate: check_out,
        // @ts-ignore
        adults: parseInt(adults),
        // @ts-ignore
        children: children?.map((c) => {
          return parseInt(c);
        }),
      },
      query: GET_AVAILABILITIES,
    });
    // @ts-ignore
    let data = result.data.properties.edges;
    logger.info(data);
    data = data.map((property: any) => {
      const hotelProp = property.node;
      const rooms = hotelProp.rooms.edges.map((room: any) => {
        return {
          id: room.node.id,
          room_name: room.node.name,
          description: room.node.description,
          photos: room.node.photos.map((photo: any) => {
            return photo.url;
          }),
          price: {
            currency: room.node.price.currency,
            amount:
              room.node.price.amount / 10 ** room.node.price.decimalPlaces,
          },
        };
      });
      return {
        hotel: {
          id: hotelProp.id,
          name: hotelProp.name,
          url: hotelProp.url,
          photos: hotelProp.photos,
          country: hotelProp.country,
        },
        rooms,
      };
    });
    ctx.status = 200;
    // @ts-ignore
    ctx.body = data;
  } catch (error) {
    // @ts-ignore
    logger.error(error.networkError);
    // @ts-ignore
    ctx.body = error.networkError.result.errors;
    // @ts-ignore
    ctx.status = error.networkError.statusCode;
  }
}
