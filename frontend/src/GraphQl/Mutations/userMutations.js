import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        id
        name
        email
        avatar
        isAdmin
      }
      token
    }
  }
`;

export const LOGOUT_USER = gql`
  mutation logout {
    logoutUser
  }`;

export const Register_USER = gql`
  mutation RegisterUser(
    $name: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
    $avatar: Upload
  ) {
    registerUser(
      name: $name
      email: $email
      password: $password
      confirmPassword: $confirmPassword
      avatar: $avatar
    ) {
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

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $name: String
    $email: String
    $avatar: Upload
  ) {
    updateUser(name: $name, email: $email, avatar: $avatar) {
      id
      name
      email
      avatar
      isAdmin
    }
  }
`;

export const UPDATE_USER_PASSWORD = gql`
  mutation UpdateUserPassword(
    $password: String!
    $confirmPassword: String!
  ) {
    updateUserPassword(
      password: $password
      confirmPassword: $confirmPassword
    ) {
      id
      name
      email
      avatar
      isAdmin
    }
  }
`;
