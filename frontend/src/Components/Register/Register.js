import { Form, Input, Message } from 'semantic-ui-react'
import './Register.css'
import { Link } from 'react-router-dom'
import RegisterHook from '../../Hooks/RegisterHook'

const Register = () => {
  const [error, handleSubmit, emailInputValue, emailInputONChangeHandler, usernameInputValue, usernameInputONChangeHandler, passwordInputValue, passwordInputONChangeHandler, confirmPasswordInputValue, confirmPasswordInputONChangeHandler, loading, uploadAvatarHandler, avatar] = RegisterHook()
  return (
    <div className="register-form ui container">
      <Form error={!!error} onSubmit={handleSubmit} className="ui large form">
        <Form.Input
          icon="user"
          iconPosition="left"
          placeholder="Username"
          name="username"
          error={
            error?.message.includes("name") || error?.message.includes("Name")
          }
          value={usernameInputValue}
          onChange={usernameInputONChangeHandler}
        />
        <Form.Input
          icon="mail"
          iconPosition="left"
          placeholder="Email"
          name="email"
          type="email"
          error={
            error?.message.includes("email") || error?.message.includes("Email")
          }
          value={emailInputValue}
          onChange={emailInputONChangeHandler}
        />
        <Form.Input
          icon="lock"
          iconPosition="left"
          placeholder="Password"
          name="password"
          type="password"
          error={
            error?.message.includes("password") ||
            error?.message.includes("Password") ||
            error?.message.includes("Passwords do not match")
          }
          value={passwordInputValue}
          onChange={passwordInputONChangeHandler}
        />
        <Form.Input
          icon="lock"
          iconPosition="left"
          placeholder="Confirm Password"
          name="confirmPassword"
          type="password"
          error={
            error?.message.includes("Confirm Password") ||
            error?.message.includes("confirmPassword") ||
            error?.message.includes("Passwords do not match")
          }
          value={confirmPasswordInputValue}
          onChange={confirmPasswordInputONChangeHandler}
        />

        <Form.Field>
          <label>Avatar</label>
          <Input
            type="file"
            label="Upload avatar"
            onChange={uploadAvatarHandler}
          />
        </Form.Field>

        {avatar && (
          <img
            src={URL.createObjectURL(avatar)}
            alt="Avatar Preview"
            className="ui image"
            style={{height: "100px", width: "100px", margin: "10px"}}
          />
        )}

        <Form.Button
          primary
          fluid
          onClick={handleSubmit}
          disabled={loading}
          loading={loading}
        >
          Register
        </Form.Button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>

        <Message error header="Register failed" content={error?.message} />
      </Form>
    </div>
  );
}

export default Register