import { Button, Form, Message, Modal } from "semantic-ui-react";
import "./AddBookModal.css";
import AddBookModalHook from "../../Hooks/AddBookModalHook";
import AddCategoryModal from "../AddCategoryModal/AddCategoryModal";

const AddBookModal = () => {
  const [
    newBookInputValues,
    modalCloseHandler,
    modalOpen,
    modalOpenHandler,
    newBookInputValuesOnChangeHandler,
    coverInputOnChangeHandler,
    pdfInputOnChangeHandler,
    addBookSubmitHandler,
    allCategoriesData,
    allCategoriesLoading,
    allCategoriesError,
    addBookLoading,
    addBookError,
  ] = AddBookModalHook();
  return (
    <div>
      <Modal
        className="add-book-modal"
        trigger={
          <Button
            labelPosition="right"
            icon="book"
            content="Add Book"
            primary
            // floated="right"
            loading={allCategoriesLoading}
          />
        }
        centered
        size="small"
        closeOnDimmerClick={!addBookLoading}
        onClose={modalCloseHandler}
        onOpen={modalOpenHandler}
        open={modalOpen}
      >
        <Modal.Header>Add Book</Modal.Header>
        <Modal.Content>
          <Form
            error={!!addBookError || !!allCategoriesError}
            className="ui form"
            id="add-book-modal-form"
          >
            <Form.Input
              label="Author"
              icon="user"
              iconPosition="left"
              placeholder="Author"
              name="author"
              value={newBookInputValues?.author}
              onChange={newBookInputValuesOnChangeHandler}
              error={
                addBookError?.message.includes("author") ||
                addBookError?.message.includes("Author")
              }
            />
            <Form.Input
              icon="book"
              iconPosition="left"
              label="Title"
              placeholder="Title"
              name="title"
              value={newBookInputValues?.title}
              onChange={newBookInputValuesOnChangeHandler}
              error={
                addBookError?.message.includes("title") ||
                addBookError?.message.includes("Title")
              }
            />
            <Form.TextArea
              label="Description"
              placeholder="Description"
              name="description"
              value={newBookInputValues?.description}
              onChange={newBookInputValuesOnChangeHandler}
              error={
                addBookError?.message.includes("description") ||
                addBookError?.message.includes("Description")
              }
            />
            <Form.Dropdown
              label="Category"
              placeholder="select Category"
              multiple
              selection
              search
              noResultsMessage="No Category Found"
              name="category"
              onChange={newBookInputValuesOnChangeHandler}
              options={allCategoriesData?.getAllCategories.map((category) => ({
                key: category.id,
                text: category.name,
                value: category.id,
              }))}
              error={
                addBookError?.message.includes("category") ||
                addBookError?.message.includes("Category")
              }
            />

            <Form.Field className="add-book-modal-add-category-field">
              <AddCategoryModal />
            </Form.Field>

            <Form.Input
              icon="file image"
              iconPosition="left"
              type="file"
              label="Cover Image"
              name="cover"
              onChange={coverInputOnChangeHandler}
              error={
                addBookError?.message.includes("cover") ||
                addBookError?.message.includes("Cover") ||
                addBookError?.message.includes("image") ||
                addBookError?.message.includes("Image")
              }
            />
            <Form.Input
              icon="file pdf"
              iconPosition="left"
              type="file"
              label="PDF"
              name="pdf"
              onChange={pdfInputOnChangeHandler}
              error={
                addBookError?.message.includes("pdf") ||
                addBookError?.message.includes("Pdf")
              }
            />
            <Message
              error
              header="Add Book Failed"
              content={addBookError?.message || allCategoriesError?.message}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            icon="checkmark"
            type="submit"
            form="add-book-modal-form"
            content="Add"
            onClick={addBookSubmitHandler}
            loading={addBookLoading}
            disabled={addBookLoading}
          />
          <Button
            icon="remove"
            floated="right"
            content="Cancel"
            onClick={modalCloseHandler}
            disabled={addBookLoading}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default AddBookModal;
