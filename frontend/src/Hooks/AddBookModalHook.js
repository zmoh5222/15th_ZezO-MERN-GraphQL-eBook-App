import { useLazyQuery, useMutation } from "@apollo/client"
import { useState } from "react"
import { GET_ALL_CATEGORIES } from "../GraphQl/Queries/categoryQueries"
import config from "../Config/config"
import swalToast from "../Utils/swalToast"
import { CREATE_BOOK } from "../GraphQl/Mutations/bookMutations"
import { GET_USER_BOOKS } from "../GraphQl/Queries/bookQueries"

const AddBookModalHook = () => {
  const [modalOpen, setModalOpen] = useState(false)

  const [newBookInputValues, setNewBookInputValues] = useState({
    author: '',
    title: '',
    description: '',
    category: [],
    cover: undefined,
    pdf: undefined,
  })

  const [addBookError, setAddBookError] = useState(null)

  // get all category query
  const [getAllCategories, { data: allCategoriesData, loading: allCategoriesLoading, error: allCategoriesError }] = useLazyQuery(GET_ALL_CATEGORIES, {
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
    },
  })

  // add book mutation
  const [addBook, { loading: addBookLoading}] = useMutation(CREATE_BOOK, {
    context: {
      headers: {
        'Apollo-Require-Preflight': true
      }
    },
    variables: newBookInputValues,
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
      setAddBookError(error)
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
      setNewBookInputValues({
        author: '',
        title: '',
        description: '',
        category: [],
        cover: undefined,
        pdf: undefined,
      })
      setModalOpen(false)
      swalToast('success', 'Book added successfully')
    },
    update: (cache, { data: { createBook: createdBook } }) => {
      const { getUserBooks } = cache.readQuery({ query: GET_USER_BOOKS })
      // getUserBooks
      cache.writeQuery({
        query: GET_USER_BOOKS,
        data: {
          getUserBooks: {
            ...getUserBooks,
            data: [
              createdBook,
              ...getUserBooks.data
            ]
          }
        }
      })
    }
  })

  const modalOpenHandler = async () => {
    await getAllCategories()
    setModalOpen(true)
  }

  const modalCloseHandler = () => {
    setModalOpen(false)
    setAddBookError(null)
    setNewBookInputValues({
      author: '',
      title: '',
      description: '',
      category: [],
      cover: undefined,
      pdf: undefined,
    })
  }
  
  const newBookInputValuesOnChangeHandler = (event, data) => {
    setNewBookInputValues({
      ...newBookInputValues,
      [data.name]: data.value
    })
  }

  const coverInputOnChangeHandler = (event, data) => {
    const file = event.target.files[0]
    
    if (!file) return

    if (file.type.split('/')[0] !== 'image') {
      setAddBookError({ message: 'Please select an image file' })
      return
    }

    const maxFilSize = config.IMAGE_MAX_SIZE
    if (file.size > maxFilSize) {
      setAddBookError({ message: `File size too large, maximum image size is ${maxFilSize / 1000000} MB` })
      return
    }

    setAddBookError(null)
    newBookInputValues.cover = file
  }

  const pdfInputOnChangeHandler = (event, data) => {
    const file = event.target.files[0]

    if (!file) return

    if (file.type.split('/')[0] !== 'application') {
      setAddBookError({ message: 'Please select an pdf file' })
      return
    }

    const maxFilSize = config.PDF_MAX_SIZE
    if (file.size > maxFilSize) {
      setAddBookError({ message: `File size too large, maximum pdf size is ${maxFilSize / 1000000} MB` })
      return
    }

    setAddBookError(null)
    newBookInputValues.pdf = file
  }

  const addBookSubmitHandler = async (event) => {
    event.preventDefault()

    if (!newBookInputValues.author || !newBookInputValues.title || !newBookInputValues.description || !newBookInputValues.category || !newBookInputValues.cover || !newBookInputValues.pdf) {
      setAddBookError({ message: 'Please fill in all fields' })
      return
    }

    await addBook()
  }
  

  return [newBookInputValues, modalCloseHandler, modalOpen, modalOpenHandler, newBookInputValuesOnChangeHandler, coverInputOnChangeHandler, pdfInputOnChangeHandler, addBookSubmitHandler, allCategoriesData, allCategoriesLoading, allCategoriesError, addBookLoading, addBookError]
}

export default AddBookModalHook