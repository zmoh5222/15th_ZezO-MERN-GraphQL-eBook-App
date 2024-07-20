import {
  Button,
  Dimmer,
  Form,
  Header,
  Icon,
  Image,
  Label,
  Loader,
  Message,
  Modal,
} from "semantic-ui-react";
import "./UpdateBookModal.css";
import { Link } from "react-router-dom";
import AddCategoryModal from "../AddCategoryModal/AddCategoryModal";
import UpdateBookModalHook from "../../Hooks/UpdateBookModalHook";
import defaultStaticImage from "../../Assets/white-image.png";

const UpdateBookModal = ({ bookId }) => {
  const [
    modalOpen,
    modalCloseHandler,
    modalOpenHandler,
    updateBookInputValues,
    updateBookInputValuesOnChangeHandler,
    updateBookSubmitHandler,
    updateBookLoading,
    getOneBookError,
    updateBookError,
    allCategoriesError,
    allCategoriesData,
    coverInputOnChangeHandler,
    pdfInputOnChangeHandler,
    newCover,
    getOneBookLoading,
    allCategoriesLoading,
    categoryOnChangeHandler,
    deleteCategoryHandler,
    currentCategories,
    addCategoryFromDropdownHandler,
    addCategoryLoading,
    addCategoryError,
  ] = UpdateBookModalHook(bookId);
  return (
    <div>
      <Modal
        trigger={
          <Link>
            <Dimmer active={getOneBookLoading || allCategoriesLoading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            <Icon name="edit" />
            Edit Book
          </Link>
        }
        centered
        size="small"
        closeOnDimmerClick={!updateBookLoading || !addCategoryLoading}
        onClose={modalCloseHandler}
        onOpen={modalOpenHandler}
        open={modalOpen}
      >
        <Header icon="archive" content="Update Book" />
        <Modal.Content>
          <Form
            className="ui form"
            error={
              !!updateBookError ||
              !!allCategoriesError ||
              !!getOneBookError ||
              !!addCategoryError
            }
          >
            <Form.Input
              icon="user"
              iconPosition="left"
              label="Author"
              placeholder="Author"
              name="author"
              value={updateBookInputValues?.author}
              onChange={updateBookInputValuesOnChangeHandler}
              error={
                updateBookError?.message.includes("author") ||
                updateBookError?.message.includes("Author")
              }
            />
            <Form.Input
              icon="book"
              iconPosition="left"
              label="Title"
              placeholder="Title"
              name="title"
              value={updateBookInputValues?.title}
              onChange={updateBookInputValuesOnChangeHandler}
              error={
                updateBookError?.message.includes("title") ||
                updateBookError?.message.includes("Title")
              }
            />
            <Form.TextArea
              label="Description"
              placeholder="Description"
              name="description"
              value={updateBookInputValues?.description}
              onChange={updateBookInputValuesOnChangeHandler}
              error={
                updateBookError?.message.includes("description") ||
                updateBookError?.message.includes("Description")
              }
            />
            <Form.Group grouped>
              {currentCategories?.map(({ id, name }) => (
                <Label key={id} color="teal" style={{ marginTop: "5px" }}>
                  <Link>
                    <Icon
                      name="delete"
                      color="red"
                      onClick={() => deleteCategoryHandler(id)}
                    />
                  </Link>
                  {name}
                </Label>
              ))}
            </Form.Group>
            <Form.Dropdown
              label="Category"
              placeholder="select Category"
              name="category"
              multiple
              selection
              search
              noResultsMessage="No Category Found"
              allowAdditions
              onAddItem={addCategoryFromDropdownHandler}
              additionLabel="Add New Category "
              loading={addCategoryLoading}
              options={allCategoriesData?.getAllCategories.map(
                ({ id, name }) => ({
                  key: id,
                  text: name,
                  value: id,
                  disabled: currentCategories.map(({ id }) => id).includes(id),
                })
              )}
              onChange={categoryOnChangeHandler}
              error={
                !!updateBookError?.message.match(/category/i) ||
                !!addCategoryError
              }
            />
            <Form.Field>
              <AddCategoryModal />
            </Form.Field>
            <Form.Field>
              <Image
                src={
                  (newCover
                    ? URL.createObjectURL(newCover)
                    : updateBookInputValues?.cover) || defaultStaticImage
                }
                style={{ height: "200px" }}
              />
            </Form.Field>
            <Form.Input
              icon="file image outline"
              iconPosition="left"
              label="Cover Image"
              name="cover"
              type="file"
              onChange={coverInputOnChangeHandler}
              error={
                updateBookError?.message.includes("cover") ||
                updateBookError?.message.includes("Cover") ||
                updateBookError?.message.includes("image") ||
                updateBookError?.message.includes("Image")
              }
            />
            <Form.Input
              icon="file pdf outline"
              iconPosition="left"
              label="PDF"
              name="pdf"
              type="file"
              onChange={pdfInputOnChangeHandler}
              error={
                updateBookError?.message.includes("pdf") ||
                updateBookError?.message.includes("PDF")
              }
            />
            <Message
              error
              header="Update Book Failed"
              content={
                updateBookError?.message ||
                allCategoriesError?.message ||
                getOneBookError?.message ||
                addCategoryError?.message
              }
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            icon="checkmark"
            content="Update"
            loading={updateBookLoading || addCategoryLoading}
            disabled={updateBookLoading}
            onClick={updateBookSubmitHandler}
          />
          <Button
            icon="close"
            content="Cancel"
            onClick={modalCloseHandler}
            disabled={updateBookLoading || addCategoryLoading}
          />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default UpdateBookModal;
