import { gql } from "@apollo/client";

export const GET_ME = gql`
  query getMe {
    getMe {
      user {
        id
        name
        email
        isAdmin
        avatar
      }
      token
    }
  }
`;

export const GET_ONE_USER = gql`
  query getOneUser($id: ID!) {
    getOneUser(id: $id) {
      id
      name
      email
      isAdmin
      avatar
    }
  }
`;
