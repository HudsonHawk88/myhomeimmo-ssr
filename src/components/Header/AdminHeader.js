import React from "react";
import {
  Navbar,
  Nav,
  NavItem,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import NavLink from "../../commons/NavLink";

const AdminHeader = (props) => {
  const { user, history, logout } = props;
  console.log("avatar: ", user.avatar);
  const avatar =
    user && user.avatar && user.avatar.length !== 0
      ? user.avatar[0].src
      : "/images/noavatar.png";

  return (
    <header>
      <Navbar color="warning" light className="admin-navbar">
        <div id="logo" />
        <Nav className="me-auto" navbar>
          <NavItem>
            <UncontrolledButtonDropdown>
              <DropdownToggle color="warning" caret>
                <img src={avatar} />
                &nbsp;
                {user.username}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem>
                  <NavLink to="/admin/profil" history={history} id="profil">
                    <i className="fas fa-user-circle"></i>&nbsp; Profil
                  </NavLink>
                </DropdownItem>
                <DropdownItem>
                  <span className="nav-link" onClick={() => logout()}>
                    <i className="fas fa-sign-out-alt"></i>&nbsp; Logout
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </NavItem>
        </Nav>
      </Navbar>
    </header>
  );
};

export default AdminHeader;
