import "./Header.css";
import { Link } from "react-router-dom";
import { MenuMenu, MenuItem, Input, Menu } from "semantic-ui-react";
import HeaderHook from "../../Hooks/HeaderHook";

const Header = () => {
  const [activeItem, isLoggedIn, logoutHandler] = HeaderHook()

  return (
    <Menu borderless pointing stackable  color="blue" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      {/* home tab */}
      <MenuItem
        name="home"
        active={activeItem === "home"}
        as={Link}
        to="/home"
      />
      {/* user books tab */}
      <MenuItem
        className={`${isLoggedIn ? "" : "hidden"}`}
        name="user-books"
        active={activeItem === "user-books"}
        as={Link}
        to="/user-books"
      />
      <MenuMenu position="right">
      {/* search input */}
        <MenuItem>
          <Input icon="search" placeholder="Search..." />
        </MenuItem>
        {/* register tab */}
        <MenuItem
          className={`${isLoggedIn ? "hidden" : ""}`}
          name="register"
          active={activeItem === "register"}
          as={Link}
          to="/register"
        />
        {/* user profile tab */}
        <MenuItem
          className={`${isLoggedIn ? "" : "hidden"}`}
          name="profile"
          active={activeItem === "profile"}
          as={Link}
          to="/profile"
        />
        {/* login tab */}
        <MenuItem
          className={`${isLoggedIn ? "hidden" : ""}`}
          name="login"
          active={activeItem === "login"}
          as={Link}
          to="/login"
        />
        {/* logout tab */}
        <MenuItem
          className={`${isLoggedIn ? "" : "hidden"}`}
          name="logout"
          active={activeItem === "logout"}
          onClick={logoutHandler}
        />
      </MenuMenu>
    </Menu>
  );
};

export default Header;
