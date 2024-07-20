import { useQuery } from "@apollo/client"
import { GET_ME } from "../GraphQl/Queries/userQueries"
import config from "../Config/config"

const GetMe = () => {
  const { data, loading, error } = useQuery(GET_ME, {
    fetchPolicy: 'cache-first',
    onError: (error) => {
      if (config.MODE === 'development') console.log({error})
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)
    },
  })
  return {
    data,
    loading,
    error
  }
}

export default GetMe