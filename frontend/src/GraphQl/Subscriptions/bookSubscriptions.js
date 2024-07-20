import { gql } from "@apollo/client";

export const NEW_BOOK = gql`
  subscription NewBook($userId: ID) {
    newBook(userId: $userId) {
      id
      author
      title
      cover
      user
    }
  }
`;
