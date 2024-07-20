import { useState } from "react"
import config from "../Config/config"
import swalToast from "../Utils/swalToast"
import { useMutation } from "@apollo/client"
import { CREATE_CATEGORY } from "../GraphQl/Mutations/categoryMutations"
import { GET_ALL_CATEGORIES } from "../GraphQl/Queries/categoryQueries"

const AddCategoryModalHook = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const [categoryInputValue, setCategoryInputValue] = useState('')

  const [addCategoryError, setAddCategoryError] = useState(null)

  // add category mutation
  const [addCategory, { loading: addCategoryLoading }] = useMutation(CREATE_CATEGORY, {
    variables: {
      name: categoryInputValue
    },
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
      setAddCategoryError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setCategoryInputValue('')
      setAddCategoryError(null)
      setModalOpen(false)
      swalToast('success', 'Category added successfully')
    },
    update: (cache, { data }) => {
      const { getAllCategories } = cache.readQuery({ query: GET_ALL_CATEGORIES })
      cache.writeQuery({
        query: GET_ALL_CATEGORIES,
        data: {
          getAllCategories: [...getAllCategories, data.createCategory]
        }
      })
    }
  })
  
  const modalCloseHandler = () => {
    setModalOpen(false)
    setCategoryInputValue('')
    setAddCategoryError(null)
  }

  const modalOpenHandler = () => {
    setModalOpen(true)
  }

  const categoryInputOnChangeHandler = (event) => {
    setCategoryInputValue(event.target.value)
  }

  const addCategorySubmitHandler = async (event) => {
    event.preventDefault()

    if (!categoryInputValue) {
      setAddCategoryError({ message: 'Please add category name' })
      return
    }

    await addCategory()
  }


  return [modalOpen, modalCloseHandler, modalOpenHandler, categoryInputValue, categoryInputOnChangeHandler, addCategorySubmitHandler, addCategoryLoading, addCategoryError]
}

export default AddCategoryModalHook