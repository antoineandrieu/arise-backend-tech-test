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
  try {
    const result = await client.query({
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
    logger.error(error);
    ctx.status = 500;
    ctx.body = error;
  }
}
