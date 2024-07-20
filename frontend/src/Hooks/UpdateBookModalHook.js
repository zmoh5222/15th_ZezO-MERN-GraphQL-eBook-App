import { useLazyQuery, useMutation } from "@apollo/client"
import { useState } from "react"
import { GET_ONE_BOOK } from "../GraphQl/Queries/bookQueries"
import { GET_ALL_CATEGORIES } from "../GraphQl/Queries/categoryQueries"
import config from "../Config/config"
import { UPDATE_BOOK } from "../GraphQl/Mutations/bookMutations"
import swalToast from "../Utils/swalToast"
import { CREATE_CATEGORY } from "../GraphQl/Mutations/categoryMutations"

const UpdateBookModalHook = (bookId) => {
  const [modalOpen, setModalOpen] = useState(false)

  const [updateBookInputValues, setUpdateBookInputValues] = useState({
    author: '',
    title: '',
    description: '',
    category: [],
    cover: undefined,
    pdf: undefined
  })

  const [currentCategories, setCurrentCategories] = useState([])
  const[newCategories, setNewCategories] = useState([])
  const [newCover, setNewCover] = useState(undefined)

  const [updateBookError, setUpdateBookError] = useState(null)
  const [addCategoryError,setAddCategoryError] = useState(null)

  const [getOneBook, { loading: getOneBookLoading, error: getOneBookError, data: getOneBookData }] = useLazyQuery(GET_ONE_BOOK, {
    variables: { getOneBookId: bookId },
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setUpdateBookInputValues({...getOneBookData?.getOneBook})
      setCurrentCategories(getOneBookData?.getOneBook?.category)
    }
  })

  const [getAllCategories, { loading: allCategoriesLoading, error: allCategoriesError, data: allCategoriesData }] = useLazyQuery(GET_ALL_CATEGORIES, {
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
    },
  })

  // add category mutation
  const [addCategory, { loading: addCategoryLoading }] = useMutation(CREATE_CATEGORY, {
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
      setAddCategoryError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setAddCategoryError(null)
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

  const [updateBook, { loading: updateBookLoading }] = useMutation(UPDATE_BOOK, {
    context: {
      headers: {
        'Apollo-Require-Preflight': true
      }
    },
    variables: updateBookInputValues,
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
      setUpdateBookError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setUpdateBookInputValues({
        author: '',
        title: '',
        description: '',
        category: [],
        cover: undefined,
        pdf: undefined
      })
      setModalOpen(false)
      setUpdateBookError(null)
      swalToast('success', 'Book updated successfully')
    },
  })

  const modalOpenHandler = async () => {
    await getOneBook()
    await getAllCategories()
    setModalOpen(true)
  }

  const modalCloseHandler = () => {
    setModalOpen(false)
    setUpdateBookInputValues({
      author: '',
      title: '',
      description: '',
      category: [],
      cover: undefined,
      pdf: undefined
    })
    setNewCover(undefined)
    setUpdateBookError(null)
    setAddCategoryError(null)
  }

  const updateBookInputValuesOnChangeHandler = (event) => {
    const { name, value } = event.target

    if (addCategoryError) setAddCategoryError(null)
    if (updateBookError) setUpdateBookError(null)

    setUpdateBookInputValues((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }

  const deleteCategoryHandler = (categoryId) => {
    setCurrentCategories(prevState => prevState.filter(({id}) => id !== categoryId))
  }

  const categoryOnChangeHandler = (event, { value }) => {
    if (addCategoryError) setAddCategoryError(null)
    setNewCategories(prevState => {
      console.log(value)
      if(!(value[value?.length - 1]).match(/^[0-9a-fA-F]{24}$/)) {
        value.pop()
        return value
      }
      return value
    })
  }

  const addCategoryFromDropdownHandler = async (event, {value} ) => {
    await addCategory({
      variables: {
        name: value
      }
    })
  }

  const coverInputOnChangeHandler = (event) => {
    const file = event.target.files[0]

    if (!file) {
      updateBookInputValues.cover = getOneBookData?.getOneBook?.cover
      setNewCover(undefined)
      return
    }

    if (file.type.split('/')[0] !== 'image') {
      setUpdateBookError({ message: 'Please select an image file' })
      return
    }

    const maxFilSize = config.IMAGE_MAX_SIZE
    if (file.size > maxFilSize) {
      setUpdateBookError({ message: `File size too large, maximum image size is ${maxFilSize / 1000000} MB` })
      return
    }

    setUpdateBookError(null)

    setUpdateBookInputValues((prevState) => ({
      ...prevState,
      cover: file
    }))

    setNewCover(file)
  }

  const pdfInputOnChangeHandler = (event) => {
    const file = event.target.files[0]

    if (!file) {
      updateBookInputValues.pdf = getOneBookData?.getOneBook?.pdf
      return
    }

    if (file.type.split('/')[0] !== 'application') {
      setUpdateBookError({ message: 'Please select an pdf file' })
      return
    }

    const maxFilSize = config.PDF_MAX_SIZE
    if (file.size > maxFilSize) {
      setUpdateBookError({ message: `File size too large, maximum pdf size is ${maxFilSize / 1000000} MB` })
      return
    }

    setUpdateBookError(null)

    setUpdateBookInputValues((prevState) => ({
      ...prevState,
      pdf: file
    }))

  }

  const updateBookSubmitHandler = async (event) => {
    event.preventDefault()

    const currentCats = currentCategories?.map(({id}) => id) || []
    const newCats = newCategories || []
    updateBookInputValues.category = [...currentCats, ...newCats]

    if (!updateBookInputValues.author || !updateBookInputValues.title || !updateBookInputValues.description || !updateBookInputValues.category) {
      setUpdateBookError({ message: 'some fields cannot be empty' })
      return
    }

    if (updateBookInputValues?.author === getOneBookData?.getOneBook?.author &&
      updateBookInputValues?.title === getOneBookData?.getOneBook?.title &&
      updateBookInputValues?.description === getOneBookData?.getOneBook?.description &&
      updateBookInputValues?.category.toString() === getOneBookData?.getOneBook?.category.map(({id}) => id).toString() &&
      updateBookInputValues?.cover === getOneBookData?.getOneBook?.cover &&
      updateBookInputValues?.pdf === getOneBookData?.getOneBook?.pdf) {
        setUpdateBookError({ message: 'No changes made' })
        return
      }

    if (updateBookInputValues.cover === getOneBookData?.getOneBook?.cover) {
      delete updateBookInputValues.cover
    }

    if (updateBookInputValues.pdf === getOneBookData?.getOneBook?.pdf) {
      delete updateBookInputValues.pdf
    }

    if (addCategoryError) setAddCategoryError(null)
    if (updateBookError) setUpdateBookError(null)

    await updateBook()
  }

  return [modalOpen, modalCloseHandler, modalOpenHandler, updateBookInputValues, updateBookInputValuesOnChangeHandler, updateBookSubmitHandler, updateBookLoading, getOneBookError, updateBookError, allCategoriesError, allCategoriesData, coverInputOnChangeHandler, pdfInputOnChangeHandler, newCover, getOneBookLoading, allCategoriesLoading, categoryOnChangeHandler, deleteCategoryHandler, currentCategories, addCategoryFromDropdownHandler, addCategoryLoading, addCategoryError]
}

export default UpdateBookModalHook