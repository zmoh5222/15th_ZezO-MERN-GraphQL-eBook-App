import {
  Button,
  Card,
  Form,
  Image,
  Message,
} from "semantic-ui-react";
import "./UserProfilePage.css";
import UserProfilePageHook from "../../Hooks/UserProfilePageHook";
import UserProfilePagePlaceholder from "./UserProfilePagePlaceholder";
import UpdateUserModal from "../../Components/UpdateUserModal/UpdateUserModal";
import defaultStaticImage from "../../Assets/white-image.png";

const UserProfilePage = () => {
  const [
    passwordInputValue,
    passwordInputOnChangeHandler,
    confirmPasswordInputValue,
    confirmPasswordInputOnChangeHandler,
    updatePasswordHandler,
    userData,
    getUserLoading,
    getUserError,
    updateUserPasswordLoading,
    updateUserPasswordError,
  ] = UserProfilePageHook();
  return (
    <div>
      <Card centered>
        <Card.Content extra>
          <UpdateUserModal />
        </Card.Content>
        {getUserError ? (
          <Card.Content extra>
            <Message error header={getUserError} />
          </Card.Content>
        ) : getUserLoading ? (
          <UserProfilePagePlaceholder />
        ) : (
          userData && (
            <>
              <Image
                src={
                  userData.getMe.user.avatar ||
                  defaultStaticImage
                }
                // wrapped
                // ui={false}
                centered
                style={{ height: "300px" }}
              />
              <Card.Content>
                <Card.Header>{userData.getMe.user.name}</Card.Header>
                <Card.Meta>
                  {userData.getMe.user.email}
                </Card.Meta>
              </Card.Content>
            </>
          )
        )}
        <Card.Content extra>
          <Form error={!!updateUserPasswordError}>
            <Form.Input
              label="New Password"
              type="password"
              placeholder="New Password"
              name="password"
              value={passwordInputValue}
              onChange={passwordInputOnChangeHandler}
              disabled={getUserLoading}
              error={
                updateUserPasswordError?.message.includes("password") ||
                updateUserPasswordError?.message.includes("Password") ||
                updateUserPasswordError?.message.includes(
                  "Passwords do not match"
                )
              }
            />
            <Form.Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
              value={confirmPasswordInputValue}
              onChange={confirmPasswordInputOnChangeHandler}
              disabled={getUserLoading}
              error={
                updateUserPasswordError?.message.includes("password") ||
                updateUserPasswordError?.message.includes("Password") ||
                updateUserPasswordError?.message.includes(
                  "Passwords do not match"
                )
              }
            />
            <Message
              error
              header="Update Failed"
              content={updateUserPasswordError?.message}
            />
            <Button
              primary
              type="submit"
              onClick={updatePasswordHandler}
              disabled={getUserLoading || updateUserPasswordLoading}
              loading={updateUserPasswordLoading}
            >
              Update Password
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
};

export default UserProfilePage;
