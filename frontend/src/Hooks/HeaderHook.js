import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { clearClientStore } from "../GraphQl/client"
import { useMutation } from "@apollo/client"
import { LOGOUT_USER } from "../GraphQl/Mutations/userMutations"
import config from "../Config/config"
import Cookies from 'js-cookie';

const HeaderHook = () => {
  // define location and navigate
  const {pathname} = useLocation()
  const navigateTo = useNavigate()

  // define active item to make menu tab active
  const [activeItem, setActiveItem] = useState(pathname.split("/")[1]);

  // check if user is logged in to show appropriate menu items
  const isLoggedIn = Cookies.get('isLoggedIn')


  // make menu tab active
  useEffect(() => {
    setActiveItem(pathname.split("/")[1])
  }, [pathname])

  // logout Mutation
  const [logoutUser] = useMutation(LOGOUT_USER, {
    onError: (error) => {
      if (config.MODE === 'development') console.log({ error })
    },
    onCompleted: (data) => {
      if (config.MODE === 'development') console.log(data)

      // navigate to home
      navigateTo("/home")
    }
  })

  // logout handler
  const logoutHandler = async () => {

    await logoutUser()
    
  }

  return [activeItem, isLoggedIn, logoutHandler]
}

export default HeaderHook