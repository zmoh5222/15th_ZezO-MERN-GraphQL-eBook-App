import { useMutation } from "@apollo/client"
import { useState } from "react"
import { UPDATE_USER_PASSWORD } from "../GraphQl/Mutations/userMutations"
import swalToast from "../Utils/swalToast"
import GetMe from "../Utils/GetMe"
import config from "../Config/config"

const UserProfilePageHook = () => {
  const [passwordInputValue, setPasswordInputValue] = useState('')
  const [confirmPasswordInputValue, setConfirmPasswordInputValue] = useState('')

  const [updateUserPasswordError, setUpdateUserPasswordError] = useState(null)

  // get me query
  const { data: userData, loading: getUserLoading, error: getUserError } = GetMe()

  // update user password mutation
  const [updateUserPassword, { loading: updateUserPasswordLoading }] = useMutation(UPDATE_USER_PASSWORD, {
    variables: {
      password: passwordInputValue,
      confirmPassword: confirmPasswordInputValue
    },
    onError: (error) => {
      if (config.MODE === 'development') console.log({error})
      setUpdateUserPasswordError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setPasswordInputValue('')
      setConfirmPasswordInputValue('')
      setUpdateUserPasswordError(null)
      swalToast('success', 'Password updated successfully')
    },
  })

  const passwordInputOnChangeHandler = (event) => {
    setPasswordInputValue(event.target.value)
  }

  const confirmPasswordInputOnChangeHandler = (event) => {
    setConfirmPasswordInputValue(event.target.value)
  }

  const updatePasswordHandler = async () => {
    if (!passwordInputValue || !confirmPasswordInputValue) {
      setUpdateUserPasswordError({ message: 'Please fill in all fields' })
      return
    }
    if (passwordInputValue !== confirmPasswordInputValue) {
      setUpdateUserPasswordError({ message: 'Passwords do not match' })
      return
    }
    await updateUserPassword()
  }

  return [
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
  ]
}

export default UserProfilePageHook