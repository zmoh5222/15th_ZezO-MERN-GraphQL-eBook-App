import { useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client"
import { useState } from "react"
import { Register_USER } from "../GraphQl/Mutations/userMutations"
import swalToast from "../Utils/swalToast"
import { GET_ME } from "../GraphQl/Queries/userQueries"
import config from "../Config/config"

const RegisterHook = () => {
  const navigateTo = useNavigate()

  const [error, setError] = useState(null)

  const [usernameInputValue, setUsernameInputValue] = useState('')
  const [emailInputValue, setEmailInputValue] = useState('')
  const [passwordInputValue, setPasswordInputValue] = useState('')
  const [confirmPasswordInputValue, setConfirmPasswordInputValue] = useState('')
  const [avatar, setAvatar] = useState(undefined)

  const [registerUser, { loading }] = useMutation(Register_USER, {
    context: {
      headers: {
        'Apollo-Require-Preflight' : true
      }
    },
    variables: {
      name: usernameInputValue,
      email: emailInputValue,
      password: passwordInputValue,
      confirmPassword: confirmPasswordInputValue,
      avatar
    },
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
      setError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setUsernameInputValue('')
      setEmailInputValue('')
      setPasswordInputValue('')
      setConfirmPasswordInputValue('')
      setError(null)
      swalToast('success', 'User registered successfully')
      navigateTo('/home')
    },
    update: (cache, { data }) => {
      cache.writeQuery({
        query: GET_ME,
        data: {
          getMe: {
            user: data.registerUser.user,
            token: data.registerUser.token
          }
        }
      })
    }
  })
  const usernameInputONChangeHandler = (event) => {
    setUsernameInputValue(event.target.value)
  }

  const emailInputONChangeHandler = (event) => {
    setEmailInputValue(event.target.value)
  }


  const passwordInputONChangeHandler = (event) => {
    setPasswordInputValue(event.target.value)
  }

  const confirmPasswordInputONChangeHandler = (event) => {
    setConfirmPasswordInputValue(event.target.value)
  }


  const uploadAvatarHandler = async (event) => {
    const file = event.target.files[0]

    if (!file) return

    if (file.type.split('/')[0] !== 'image') {
      setError({message: 'Please select an image file'})
      return
    }

    const maxFilSize = config.IMAGE_MAX_SIZE
    if (file.size > maxFilSize) {
      setError({message: `File size too large, maximum file size is ${maxFilSize / 1000000}MB`})
      return
    }

    setError(null)

    setAvatar(file)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!usernameInputValue || !emailInputValue || !passwordInputValue || !confirmPasswordInputValue) {
      setError({message: 'Please fill in all fields'})
      return
    }

    if (passwordInputValue !== confirmPasswordInputValue) {
      setError({message: 'Passwords do not match'})
      return
    }

    setError(null)

    await registerUser()

  }
  return [error, handleSubmit, emailInputValue, emailInputONChangeHandler, usernameInputValue, usernameInputONChangeHandler, passwordInputValue, passwordInputONChangeHandler, confirmPasswordInputValue, confirmPasswordInputONChangeHandler, loading, uploadAvatarHandler, avatar]
}

export default RegisterHook