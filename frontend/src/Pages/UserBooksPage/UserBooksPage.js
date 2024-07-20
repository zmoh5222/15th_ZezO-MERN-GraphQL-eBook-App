import React from "react";
import "./UserBooksPage.css";
import AddBookModal from "../../Components/AddBookModal/AddBookModal";
import UserBooksPageHook from "../../Hooks/UserBooksPageHook";
import BookCard from "../../Components/BookCard/BookCard";
import { Card, Container, Grid } from "semantic-ui-react";

const UserBooksPage = () => {
  const [data] = UserBooksPageHook();
  return (
    <Container>
      <Grid  stackable doubling centered divided="vertically">
        <Grid.Row>
          <Grid.Column width={16} textAlign="right">
            <AddBookModal />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          {data?.getUserBooks?.data.map((book) => {
            return (
              <Grid.Column key={book.id} mobile={16} tablet={8} computer={5} largeScreen={4}>
                <BookCard book={book} />
              </Grid.Column>
            );
          })}
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default UserBooksPage;
