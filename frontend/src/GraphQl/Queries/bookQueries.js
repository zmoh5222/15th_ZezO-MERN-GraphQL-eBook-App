import { gql } from "@apollo/client";

export const GET_ALL_BOOKS = gql`
  query GetAllBooks(
    $page: Int
    $limit: Int
    $sort: String
    $first: Int
    $last: Int
    $filter: [Filter]
    $search: [Search]
  ) {
    getAllBooks(
      page: $page
      limit: $limit
      sort: $sort
      first: $first
      last: $last
      filter: $filter
      search: $search
    ) {
      data {
        id
        author
        title
        cover
        user
      }
      pagination {
        limit
        previousPage
        currentPage
        nextPage
        totalPages
        resultTotalDocuments
        overallDocuments
      }
    }
  }
`;

export const GET_USER_BOOKS = gql`
  query GetUserBooks(
    $page: Int
    $limit: Int
    $sort: String
    $first: Int
    $last: Int
    $filter: [Filter]
    $search: [Search]
  ) {
    getUserBooks(
      page: $page
      limit: $limit
      sort: $sort
      first: $first
      last: $last
      filter: $filter
      search: $search
    ) {
      data {
        id
        author
        title
        cover
        user
      }
      pagination {
        limit
        previousPage
        currentPage
        nextPage
        totalPages
        resultTotalDocuments
        overallDocuments
      }
    }
  }
`;

export const GET_ONE_BOOK = gql`
  query GetOneBook($getOneBookId: ID!) {
    getOneBook(id: $getOneBookId) {
      id
      author
      title
      description
      category {
        id
        name
      }
      cover
      pdf
    }
  }
`;
