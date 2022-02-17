# GiveMeAnHotel.com Adapter 

[context](./docs/instructions.md)

## Get availabilities

Filter by hotel id, country

## Workflow

1. Test request with Altair
gql request: filter by partner ref
```gql
query	{
  properties (query: {
    partnerExternalRefs: {partner: "GMAH", externalIds:["61102"]}
  },first: 100) {
    edges {
      node {
        id
        name
        country
        url
        photos
        rooms (startDate: "2022-02-17", endDate: "2022-02-20", adults: 2, children:[5, 1], first:100) {
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

```

2. Add the request into http handler

Go with apollo-client at first but it seems more adpated to React
