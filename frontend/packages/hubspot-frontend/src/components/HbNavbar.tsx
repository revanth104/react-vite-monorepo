import React from "react";
import { Navbar, Container } from "react-bootstrap";

export interface IHbNavbar {
  altText: string;
  logo: string;
  text: string;
}

const HbNavbar = (props: IHbNavbar) => {
  const { altText, logo, text } = props;
  return (
    <Navbar className="navbar-bg">
      <Container className="py-3">
        <Navbar.Brand className="d-flex flex-row align-items-center">
          <img
            alt={altText}
            src={logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          {text && <p className="app-name ms-2 mb-0">{text}</p>}
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default HbNavbar;
