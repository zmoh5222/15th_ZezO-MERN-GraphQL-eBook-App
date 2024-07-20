import { useMutation } from "@apollo/client"
import { useState } from "react"
import { LOGIN_USER } from "../GraphQl/Mutations/userMutations"
import swalToast from "../Utils/swalToast"
import { useNavigate } from "react-router-dom"
import { GET_ME } from "../GraphQl/Queries/userQueries"
import config from "../Config/config"

const LoginHook = () => {
  // define navigate
  const navigateTo = useNavigate()

  // define error
  const [error, setError] = useState(null)

  // define input values
  const [emailInputValue, setEmailInputValue] = useState('')
  const [passwordInputValue, setPasswordInputValue] = useState('')

  // login mutation
  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    variables: {
      email: emailInputValue,
      password: passwordInputValue
    },
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
      setError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setEmailInputValue('')
      setPasswordInputValue('')
      setError(null)
      swalToast("success", "Login successfully")
      navigateTo('/home')
    },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: GET_ME,
        data: {
          getMe: {
            user: data.loginUser.user,
            token: data.loginUser.token
          }
        }
      })
    },
  })

  const emailInputONChangeHandler = (e) => {
    setEmailInputValue(e.target.value)
  }

  const passwordInputONChangeHandler = (e) => {
    setPasswordInputValue(e.target.value)
  }

  const loginOnClickHandler = async (event) => {
    event.preventDefault()

    if (!emailInputValue || !passwordInputValue) {
      setError({ message: 'Please fill in all fields' })
      return
    }
    
    setError(null)

    await loginUser()
  }

  return [emailInputValue, emailInputONChangeHandler, passwordInputValue, passwordInputONChangeHandler, loginOnClickHandler, loading, error]
}

export default LoginHook