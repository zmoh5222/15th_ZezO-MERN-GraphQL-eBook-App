

const detectError = (error) => {
  if(error) {
    if (error.graphQLErrors) return error.graphQLErrors.map(({ message }) => message).join(", ")
    if (error.clientErrors) return error.clientErrors.map(({ message }) => message).join(", ")
    if (error.protocolErrors) return error.protocolErrors.map(({ message }) => message).join(", ")
    if (error.networkError) return error.networkError.result.errors.map(({ message }) => message).join(", ")
    if (error.message) return error.message
  }
}

export default detectError