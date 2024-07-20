import { gql } from "@apollo/client";

export const CREATE_BOOK = gql`
  mutation CreateBook(
    $title: String!
    $author: String!
    $description: String!
    $category: [ID]!
    $cover: Upload!
    $pdf: Upload!
  ) {
    createBook(
      title: $title
      author: $author
      description: $description
      category: $category
      cover: $cover
      pdf: $pdf
    ) {
      id
      author
      title
      cover
      user
    }
  }
`;

export const UPDATE_BOOK = gql`
  mutation UpdateBook(
    $id: ID!
    $title: String
    $author: String
    $description: String
    $category: [ID]
    $cover: Upload
    $pdf: Upload
  ) {
    updateBook(
      id: $id
      title: $title
      author: $author
      description: $description
      category: $category
      cover: $cover
      pdf: $pdf
    ) {
      id
      author
      title
      cover
    }
  }
`;
