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
      contactPerson {
        firstName
        lastName
      }
      price {
        currency
        amount
        decimalPlaces
      }
      property {
        id
        name
        country
        url
        photos
        partnerReferences {
          partner
          externalId
        }
      }
      room {
        id
        name
        description
        photos {
          url
          caption
        }
        price {
          currency
          amount
          decimalPlaces
        }
        remaining
      }
    }
  }
`;

export default async function postBooking(ctx: Context) {
  logger.debug(ctx.request.body);
  const {
    hotel_partner_ref,
    room_type_partner_ref,
    check_in,
    check_out,
    primary_contact,
    adults,
    children,
    price,
  } = ctx.request.body;
  try {
    const result = await client.mutate({
      variables: {
        payload: {
          hotelId: hotel_partner_ref,
          roomId: room_type_partner_ref,
          checkIn: check_in,
          checkOut: check_out,
          adults,
          children,
          price,
          contactPerson: primary_contact,
        },
      },
      mutation: CREATE_BOOKING,
    });
    // @ts-ignore
    const rawData = result.data.createReservation;
    const property = rawData.property;
    const room = rawData.room;
    const data = {
      hotel: {
        id: property.id,
        name: property.name,
        url: property.url,
        photos: property.photos,
        country: property.country,
      },
      rooms: {
        id: room.id,
        room_name: room.name,
        description: room.description,
        photos: room.photos.map((photo: any) => {
          return photo.url;
        }),
        price: {
          currency: room.price.currency,
          amount: room.price.amount / 10 ** room.price.decimalPlaces,
        },
      },
    };
    ctx.status = 201;
    // @ts-ignore
    ctx.body = data;
  } catch (error) {
    logger.error(error);
    ctx.status = 500;
  }
}
