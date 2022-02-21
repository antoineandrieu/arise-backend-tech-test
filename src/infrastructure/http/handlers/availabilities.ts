import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client/core";
import fetch from "cross-fetch";
import { Context } from "koa";
import logger from "../../../logger";
import {
  Maybe,
  Scalars,
  PartnerExternalRefsInput,
  Property,
  Query,
} from "../../../../types/global";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache: new InMemoryCache({}),
  link: new HttpLink({ uri: process.env.GRAPHQL_ENDPOINT, fetch }),
});

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
          partnerReferences {
            externalId
          }
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

type PropertiesQueryInput = {
  partnerExternalRefs?: Maybe<PartnerExternalRefsInput>;
  startDate: Scalars["String"];
  endDate: Scalars["String"];
  adults: Scalars["Int"];
  children?: Maybe<Array<Scalars["Int"]>>;
};

export default async function getAvailabilities(ctx: Context) {
  const { hotel_id, check_in, check_out, adults, children } = ctx.request.query;
  if (!hotel_id && !check_in && !check_out && !adults) {
    ctx.throw(400, "Missing query params");
  }
  // Format children field
  let childrenField: number[] = [];
  if (typeof children === "string") {
    childrenField = [parseInt(children)];
  } else if (typeof children === "object") {
    childrenField = children?.map((child) => parseInt(child));
  }
  try {
    const result = await client.query<Query, PropertiesQueryInput>({
      variables: {
        partnerExternalRefs: {
          partner: "GMAH",
          externalIds:
            typeof hotel_id === "string"
              ? [hotel_id]
              : (hotel_id as Array<string>),
        },
        startDate: check_in as string,
        endDate: check_out as string,
        adults: parseInt(adults as string),
        children: childrenField,
      },
      query: GET_AVAILABILITIES,
    });
    const rawData = result?.data?.properties?.edges;
    if (rawData) {
      const data = rawData.map((property) => {
        // @ts-ignore
        const hotelProp: Property = property.node;
        // @ts-ignore
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
            partner_reference: hotelProp.partnerReferences[0].externalId,
            name: hotelProp.name,
            url: hotelProp.url,
            photos: hotelProp.photos,
            country: hotelProp.country,
          },
          rooms,
        };
      });
      ctx.status = 200;
      ctx.body = data;
    }
    ctx.status = 404;
  } catch (error) {
    logger.error(error);
    //@ts-ignore
    logger.error(error.networkError);
    //@ts-ignore
    ctx.body = error.networkError.result.errors;
    //@ts-ignore
    ctx.status = error.networkError.statusCode;
  }
}
