import { Form, Message } from 'semantic-ui-react'
import './Login.css'
import LoginHook from '../../Hooks/LoginHook'
import { Link } from 'react-router-dom'

const Login = () => {
  const [emailInputValue, emailInputONChangeHandler, passwordInputValue, passwordInputONChangeHandler, loginOnClickHandler, loading, error] = LoginHook()
  return (
    <div className="login-form ui container">
      <Form error={!!error} size='large'>
        <Form.Input
          icon='mail'
          iconPosition='left'
          placeholder='Email'
          name="email"
          type="email"
          error={error?.message.includes("email") || error?.message.includes("Email")}
          value={emailInputValue}
          onChange={emailInputONChangeHandler}
        />
        <Form.Input
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          name="password"
          type="password"
          error={error?.message.includes("password") || error?.message.includes("Password")}
          value={passwordInputValue}
          onChange={passwordInputONChangeHandler}
        />

        <Form.Button primary fluid onClick={loginOnClickHandler} disabled={loading} loading={loading}>Login</Form.Button>

        <p>Don't have an account? <Link to='/register'>Register</Link></p>

        <Message error header='Login failed' content={error?.message}/>

      </Form>

    </div>
  )
}

export default Login