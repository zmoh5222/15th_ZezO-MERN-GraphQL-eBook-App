import { Button, Form, Icon, Image, Message, Modal } from "semantic-ui-react";
import "./UpdateUserModal.css";
import UpdateUserModalHook from "../../Hooks/UpdateUserModalHook";
import { Link } from "react-router-dom";
import defaultStaticImage from "../../Assets/white-image.png";

const UpdateUserModal = () => {
  const [modalCloseHandler, modalOpen, modalOpenHandler, updatedAvatar, nameInputOnChangeHandler, nameInputValue, emailInputOnChangeHandler, emailInputValue, updateUserError, updateUserLoading, userData, uploadAvatarHandler, modalSubmitHandler] = UpdateUserModalHook();
  return (
    <div>
      <Modal
        trigger={
          <Link>
            <Icon name="edit" />
            Edit Profile
          </Link>
        }
        size="small"
        closeOnDimmerClick={!updateUserLoading}
        onClose={modalCloseHandler}
        onOpen={modalOpenHandler}
        open={modalOpen}
      >
        <Modal.Header>Change Profile</Modal.Header>
        <Modal.Content>
          <Image
            src={
              (updatedAvatar
                ? URL.createObjectURL(updatedAvatar)
                : userData?.getMe.user.avatar) ||
                defaultStaticImage
            }
            centered
            style={{ height: "300px", maxWidth: "290px" }}
          />
          <Form error={!!updateUserError}>
            <Form.Input
              label="Name"
              placeholder="Name"
              name="name"
              value={nameInputValue}
              onChange={nameInputOnChangeHandler}
              error={
                updateUserError?.message.includes("name") ||
                updateUserError?.message.includes("Name")
              }
            />
            <Form.Input
              label="Email"
              placeholder="Email"
              type="email"
              name="email"
              value={emailInputValue}
              onChange={emailInputOnChangeHandler}
              error={
                updateUserError?.message.includes("email") ||
                updateUserError?.message.includes("Email")
              }
            />
            <Form.Input
              label="Avatar"
              type="file"
              onChange={uploadAvatarHandler}
            />
            <Message
              error
              header="Update Failed"
              content={updateUserError?.message}
            />
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button
            primary
            icon='checkmark'
            content='Save'
            onClick={modalSubmitHandler}
            disabled={updateUserLoading}
            loading={updateUserLoading}
          />
          <Button icon='close' content='Cancel' onClick={modalCloseHandler} disabled={updateUserLoading} />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

export default UpdateUserModal;
