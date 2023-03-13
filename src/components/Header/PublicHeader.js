import React from 'react';
import { Navbar, Collapse, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { Link } from 'react-router-dom';

const PublicHeader = (props) => {
    let { history } = props;

    const toggleNavbar = (id) => {
        const collapse = document.getElementById(id);
        collapse.classList.toggle('show');
    };

    return (
        <React.Fragment>
            <div id="logo" />
            <div className="plus_nav">
                <div className="plus_content">
                    {/*                     <div className="tel">
                        <i aria-hidden className="fas fa-phone-alt"></i>&nbsp; +36-20/461-9075
                    </div> */}
                    <div className="kozossegi">
                        <a href="https://www.facebook.com/myhomeberkimonika" target="_blank" rel="noreferrer">
                            <i aria-hidden className="fab fa-facebook-square"></i>
                        </a>
                        <a href="https://www.instagram.com/myhomeberkimonika/" target="_blank" rel="noreferrer">
                            <i aria-hidden className="fab fa-instagram"></i>
                        </a>
                        <a href="https://www.tiktok.com/@myhomeingatlan" target="_blank" rel="noreferrer">
                            <i className="fab fa-tiktok"></i>
                        </a>
                        <a href="#" target="_blank" rel="noreferrer">
                            <i aria-hidden className="fab fa-whatsapp"></i>
                        </a>
                    </div>
                </div>
            </div>
            <Navbar expand="lg" light className="public-navbar" dark>
                <div className="navbar-toggler" onClick={() => toggleNavbar('public_navbar_collapse')}>
                    <i aria-hidden className="fas fa-bars"></i>
                </div>
                <Collapse navbar id="public_navbar_collapse">
                    <Nav navbar className="me-auto public-navbar__nav">
                        <NavItem className="nav-item public-navbar__nav-item">
                            <a className="nav-link public-navbar__nav-link" href="/">
                                {/* <i className="far fa-bookmark"></i> */}
                                <i aria-hidden className="fas fa-home" />
                                &nbsp; Főoldal
                            </a>
                        </NavItem>
                        <NavItem className="nav-item public-navbar__nav-item">
                            <Link className="nav-link public-navbar__nav-link" to="/ingatlanok" replace>
                                {/* <i className="fas fa-home" /> */}
                                <i aria-hidden className="fas fa-house-user"></i>
                                &nbsp; Ingatlanok
                            </Link>
                        </NavItem>
                        <UncontrolledDropdown className="nav-item public-navbar__nav-item" inNavbar nav>
                            <DropdownToggle nav caret className="nav-link public-navbar__nav-link">
                                <i aria-hidden className="fas fa-briefcase"></i>
                                &nbsp; Szolgáltatások
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <Link className="nav-link public-navbar__nav-link" to="/ingatlanszolgaltatasok" replace>
                                        <i aria-hidden className="fas fa-handshake"></i>
                                        &nbsp; Ingatlan szolgáltatások
                                    </Link>
                                </DropdownItem>
                                <DropdownItem>
                                    <Link className="nav-link public-navbar__nav-link" to="/penzugyiszolgaltatasok" replace>
                                        <i aria-hidden className="fas fa-piggy-bank"></i>
                                        &nbsp; Pénzügyi szolgáltatások
                                    </Link>
                                </DropdownItem>
                                {/* <DropdownItem>
                    <Link className="nav-link public-navbar__nav-link" to="/energetika" history={history}>
                      <i className="fab fa-envira"></i>
                      &nbsp; Energetikai tanusítvány
                    </Link>
                  </DropdownItem> */}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <NavItem className="nav-item public-navbar__nav-item">
                            <Link className="nav-link public-navbar__nav-link" to="/rolunk" replace>
                                <i aria-hidden className="fas fa-info-circle"></i>
                                &nbsp; Rólunk
                            </Link>
                        </NavItem>
                        <NavItem className="nav-item public-navbar__nav-item">
                            <Link className="nav-link public-navbar__nav-link" to="/kapcsolat" replace>
                                <i aria-hidden className="fas fa-phone-alt"></i>
                                &nbsp; Kapcsolat
                            </Link>
                        </NavItem>
                        {/* <UncontrolledDropdown className="nav-item public-navbar__nav-item" inNavbar nav>
                            <DropdownToggle nav caret className="nav-link public-navbar__nav-link">
                                <i aria-hidden className="far fa-file-alt"></i>
                                &nbsp; GDPR
                            </DropdownToggle>
                            <DropdownMenu>
                                <DropdownItem>
                                    <Link className="nav-link public-navbar__nav-link" to="/adatkezeles" replace>
                                        <i aria-hidden className="far fa-id-card"></i>
                                        &nbsp; Adatkezelési tájékoztató
                                    </Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown> */}
                        <NavItem className="nav-item public-navbar__nav-item">
                            <Link className="nav-link public-navbar__nav-link" to="/myjob" id="myjob" replace>
                                <i aria-hidden className="fas fa-shapes"></i>
                                &nbsp; Dolgozz Velünk!
                            </Link>
                        </NavItem>
                        {/* <NavItem className="nav-item public-navbar__nav-item">
                            <Link className="nav-link public-navbar__nav-link" to="/myart" id="myart" replace>
                                <i aria-hidden className="fas fa-shapes"></i>
                                &nbsp; MyArt
                            </Link>
                        </NavItem> */}
                    </Nav>
                </Collapse>
            </Navbar>
        </React.Fragment>
    );
};

export default PublicHeader;
