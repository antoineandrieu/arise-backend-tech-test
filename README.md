# GiveMeAnHotel.com Adapter 

This is the submission for the [Arise backend challenge](./docs/instructions.md).

## Get availabilities

Filter by hotel id, country

## Workflow

### 1. Test the get availabilities request with Altair - 15min

I read the challenge instructions and discovered the Arise API.

### 2. Add the request into http handler - 45min

I decided to install a graphQL client to abstract the requests. I went with [apollo-client](https://github.com/apollographql/apollo-client). It might not the best choice because it's designed to work first with React. We should probaly use a lighter client or create our own wrapper. 

I created a dummy request to test the client integration and get the full data pipeline working.

### 3. Improve the request handling by adding parameters - 30min

I updated the code to take real parameters into account.

### 4. Add Booking request - 30min

I then added the booking request, by testing it first with Altair before adding the route and the handler.

I had to update openapi definition to add check-in and check-out dates.
Use ids as partner ref hotel and room.

### 5. Check input and handle errors - 45min

I added custom middlewares to check inputs with [Joi library](https://joi.dev/).

### 6. Add TypeScript definitions - Work In Progress - 30 min

I downloaded the SDL from Altair and converted it to TypeScript with an [online tool](https://transform.tools/graphql-to-typescript). I then integrated the created types into the app and added the types to the variables. 

### 7. Handle advanced errors - To Do
- Non existant hotel or room id
- Non matching price
- Network error

### 8. Add authentication - To Do
