import { useQuery, useSubscription } from "@apollo/client"
import { GET_USER_BOOKS } from "../GraphQl/Queries/bookQueries"
import config from "../Config/config"
import { NEW_BOOK } from "../GraphQl/Subscriptions/bookSubscriptions"

const UserBooksPageHook = () => {
  // get user books query
  const { loading, error, data } = useQuery(GET_USER_BOOKS, {
    fetchPolicy: 'cache-first',
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
    },
  })

  // new book subscription
  const { data: subscriptionData } = useSubscription(NEW_BOOK, {
    variables: {
      userId: "65f61d55ba94d228704edfeb"
    },
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
    },
  onData: (data) => {
    if (config.MODE === 'development') console.log(data)
  },
  })

  return [data]
}

export default UserBooksPageHook