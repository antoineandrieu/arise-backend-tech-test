export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export enum Countries {
  Fr = "FR",
  De = "DE",
  Es = "ES",
  Pl = "PL",
  Pt = "PT",
  Gr = "GR",
  Nl = "NL",
}

export enum Currency {
  Eur = "EUR",
  Usd = "USD",
  Gbp = "GBP",
  Pln = "PLN",
}

export type Photo = {
  __typename?: "Photo";
  url: Scalars["String"];
  caption?: Maybe<Scalars["String"]>;
};

/** An amount with a currency. Prices are given in integers, with the number of decimals given in decimalPlaces */
export type CurrencyAmount = {
  __typename?: "CurrencyAmount";
  currency: Currency;
  amount: Scalars["Int"];
  decimalPlaces: Scalars["Int"];
};

/** An amount with a currency. Prices are given in integers, with the number of decimals given in decimalPlaces */
export type CurrencyAmountInput = {
  currency: Currency;
  amount: Scalars["Int"];
  decimalPlaces: Scalars["Int"];
};

/** A reference to an identifier on a given partner's system */
export type PartnerExtRef = {
  __typename?: "PartnerExtRef";
  partner: Scalars["String"];
  externalId: Scalars["String"];
};

/** A person */
export type Person = {
  __typename?: "Person";
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
};

/** A person */
export type PersonInput = {
  firstName?: Maybe<Scalars["String"]>;
  lastName?: Maybe<Scalars["String"]>;
};

/** Representation of a property (ie. an hotel) in the network */
export type Property = {
  __typename?: "Property";
  /** The id of the property */
  id: Scalars["String"];
  /** The name of the property */
  name: Scalars["String"];
  /** The country of the property */
  country?: Maybe<Countries>;
  /** The url of the property */
  url?: Maybe<Scalars["String"]>;
  /** The photos of the property */
  photos?: Maybe<Array<Maybe<Scalars["String"]>>>;
  /** List of IDs of the property outside of the Arise network */
  partnerReferences: Array<PartnerExtRef>;
  rooms?: Maybe<RoomConnection>;
};

/** Representation of a property (ie. an hotel) in the network */
export type PropertyRoomsArgs = {
  startDate: Scalars["String"];
  endDate: Scalars["String"];
  adults: Scalars["Int"];
  children?: Maybe<Array<Scalars["Int"]>>;
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["String"]>;
  last?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["String"]>;
};

/** Input for the properties query */
export type PropertiesQueryInput = {
  /** When set, retrives properties by their partner reference */
  partnerExternalRefs?: Maybe<PartnerExternalRefsInput>;
};

/** A type of room available in a property */
export type Room = {
  __typename?: "Room";
  id: Scalars["String"];
  name: Scalars["String"];
  description?: Maybe<Scalars["String"]>;
  photos?: Maybe<Array<Maybe<Photo>>>;
  price?: Maybe<CurrencyAmount>;
  remaining?: Maybe<Scalars["Int"]>;
};

export type Reservation = {
  __typename?: "Reservation";
  id?: Maybe<Scalars["ID"]>;
  checkIn?: Maybe<Scalars["String"]>;
  checkOut?: Maybe<Scalars["String"]>;
  contactPerson?: Maybe<Person>;
  price?: Maybe<CurrencyAmount>;
  property?: Maybe<Property>;
  room?: Maybe<Room>;
};

export type RoomConnection = {
  __typename?: "RoomConnection";
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<RoomEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type RoomEdge = {
  __typename?: "RoomEdge";
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars["String"];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node?: Maybe<Room>;
};

/** PageInfo cursor, as defined in https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
export type PageInfo = {
  __typename?: "PageInfo";
  /** Used to indicate whether more edges exist following the set defined by the clients arguments. */
  hasNextPage: Scalars["Boolean"];
  /** Used to indicate whether more edges exist prior to the set defined by the clients arguments. */
  hasPreviousPage: Scalars["Boolean"];
  /** The cursor corresponding to the first nodes in edges. Null if the connection is empty. */
  startCursor?: Maybe<Scalars["String"]>;
  /** The cursor corresponding to the last nodes in edges. Null if the connection is empty. */
  endCursor?: Maybe<Scalars["String"]>;
};

export type PartnerExternalRefsInput = {
  /** The partner of the property */
  partner: Scalars["String"];
  /** The external IDs of the property on the partner's system */
  externalIds: Array<Scalars["String"]>;
};

export type PropertyConnection = {
  __typename?: "PropertyConnection";
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Edge-Types */
  edges?: Maybe<Array<Maybe<PropertyEdge>>>;
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-undefined.PageInfo */
  pageInfo: PageInfo;
};

export type PropertyEdge = {
  __typename?: "PropertyEdge";
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Cursor */
  cursor: Scalars["String"];
  /** https://facebook.github.io/relay/graphql/connections.htm#sec-Node */
  node?: Maybe<Property>;
};

export type CreateReservationInput = {
  hotelId: Scalars["String"];
  roomId: Scalars["String"];
  checkIn: Scalars["String"];
  checkOut: Scalars["String"];
  contactPerson?: Maybe<PersonInput>;
  adults: Scalars["Int"];
  childrenAges?: Maybe<Array<Scalars["Int"]>>;
  price: CurrencyAmountInput;
};

export type Query = {
  __typename?: "Query";
  /** Lists the properties on the Arise network. */
  properties?: Maybe<PropertyConnection>;
};

export type QueryPropertiesArgs = {
  query?: Maybe<PropertiesQueryInput>;
  first?: Maybe<Scalars["Int"]>;
  after?: Maybe<Scalars["String"]>;
  last?: Maybe<Scalars["Int"]>;
  before?: Maybe<Scalars["String"]>;
};

export type Mutation = {
  __typename?: "Mutation";
  /** Create a new reservation */
  createReservation: Reservation;
};

export type MutationCreateReservationArgs = {
  payload: CreateReservationInput;
};
