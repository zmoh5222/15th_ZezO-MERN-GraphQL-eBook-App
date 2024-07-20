import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import config from '../Config/config';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new GraphQLWsLink(createClient({
  url: config.WS_URI,
}));

const uploadLink = createUploadLink({
  uri: config.API_URI,
  credentials: 'include',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  uploadLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
})

// clear Apollo Client function
export const clearClientStore = () => {
  // Reset the Apollo Client cache
  client.clearStore();
};

export default client