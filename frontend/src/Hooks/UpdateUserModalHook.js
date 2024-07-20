import { useMutation } from "@apollo/client"
import { useState } from "react"
import { UPDATE_USER } from "../GraphQl/Mutations/userMutations"
import swalToast from "../Utils/swalToast"
import config from "../Config/config"
import GetMe from "../Utils/GetMe"

const UpdateUserModalHook = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const [nameInputValue, setNameInputValue] = useState('')
  const [emailInputValue, setEmailInputValue] = useState('')
  const [updatedAvatar, setUpdatedAvatar] = useState(undefined)

  const [updateUserError, setUpdateUserError] = useState(null)

  const { data: userData } = GetMe()

  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER, {
    context: {
      headers: {
        'Apollo-Require-Preflight': true
      }
    },
    variables: {
      name: nameInputValue,
      email: emailInputValue,
      avatar: updatedAvatar
    },
    onError: (error) => {
      if (config.MODE === 'development') console.log({error})
      setUpdateUserError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setModalOpen(false)
      setNameInputValue('')
      setEmailInputValue('')
      setUpdatedAvatar(undefined)
      setUpdateUserError(null)
      swalToast('success', 'Profile updated successfully')
    },
  })

  const modalOpenHandler = () => {
    setNameInputValue(userData?.getMe.user.name)
      setEmailInputValue(userData?.getMe.user.email)
    setModalOpen(true)
  }

  const modalCloseHandler = () => {
    setModalOpen(false)
    setUpdateUserError(null)
    setNameInputValue('')
    setEmailInputValue('')
    setUpdatedAvatar(undefined)
  }

  const nameInputOnChangeHandler = (event) => {
    setNameInputValue(event.target.value)
  }

  const emailInputOnChangeHandler = (event) => {
    setEmailInputValue(event.target.value)
  }

  const uploadAvatarHandler = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    if (file.type.split('/')[0] !== 'image') {
      setUpdateUserError({ message: 'Please select an image file' })
      return
    }
    const maxFilSize = config.IMAGE_MAX_SIZE
    if (file.size > maxFilSize) {
      setUpdateUserError({ message: `File size too large, maximum file size is ${maxFilSize / 1000000}MB` })
      return
    }
    setUpdateUserError(null)
    setUpdatedAvatar(file)
  }

  const modalSubmitHandler = async (event) => {
    event.preventDefault()

    if (!nameInputValue || !emailInputValue) {
      setUpdateUserError({ message: 'Please fill in all fields' })
      return
    }

    if (nameInputValue === userData?.getMe.user.name && emailInputValue === userData?.getMe.user.email && updatedAvatar === undefined) {
      setUpdateUserError({ message: 'No changes made' })
      return
    }

    setUpdateUserError(null)

    await updateUser()
  }

  return [modalCloseHandler, modalOpen, modalOpenHandler, updatedAvatar, nameInputOnChangeHandler, nameInputValue, emailInputOnChangeHandler, emailInputValue, updateUserError, updateUserLoading, userData, uploadAvatarHandler, modalSubmitHandler]
}

export default UpdateUserModalHook