import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../../utils/AppTheme.jsx";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "../../assets/Images/visibility.png";
import InvisibilityIcon from "../../assets/Images/invisibility.png";
import File from "../../assets/Images/logoImg.png";
import signinback from "../../assets/Images/signinback.svg";
import bottomImage from "../../assets/Images/bottomImage.png";
import { Link } from "react-router-dom";
import { signUp } from "../../service/stellarApi";
import { useNavigate } from "react-router-dom";

import {
  PageLayoutContainer,
  FromGroup,
  StyleBox,
  StyleDiv,
  StyleImage,
} from "../../style/containers";
import { validateFormData } from "../../utils/common";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";
import Header from "../../components/Header";

export default function SignUp(props) {
  const [formDetails, setFormDetails] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    hashPassword: "",
  });
  const [formErrors, setFormErrors] = React.useState(formDetails);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const navigate = useNavigate();
  const handleChange = (event) => {
    const { name, value } = event.target;
    const data = { ...formDetails, [name]: value };
    setFormDetails(data);
    const formValidated = validateFormData(data, name);
    setFormErrors(formValidated.errors);
    if (!formValidated.isValidated) {
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formValidated = validateFormData(formDetails);
    setFormErrors(formValidated.errors);
    if (!formValidated.isValidated) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const formDataObj = Object.fromEntries(data.entries());
    await signUp(formDataObj)
      .then((res) => {
        if (res.ok) {
          toast.success(res.data);
          navigate("/emailVerified");
          return;
        }
        toast.error(res.error);
      })
      .catch((error) => {
        console.log({ error });
        toast.error(res.error);
      });
  };

  return (
    <div style={{ height: "100vh" }}>
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <PageLayoutContainer
          className="PageLayoutContainer"
          direction="column"
          justifyContent="space-between"
          style={{ display: "flex", flexDirection: "column" }}
        >
           <div className="AlignRightside">
            {" "}
            <Header />
          </div> 
          <styleDivMain>
            <form
              className="d-flex MainDiv"
              component="form"
              onSubmit={handleSubmit}
              noValidate
            >
              <StyleImage>
                <img src={bottomImage} alt="TopImg" className="TopImg" /> 
                <img src={signinback} alt="My File" className="signinback"/>
                <div className="gradientOverlay"></div>
                <div className="AfterDiv">
                  <StyleDiv className="StyleDiv">
                    <div>
                      <img src={File} alt="My File" />
                    </div>
                  </StyleDiv>
                  <StyleBox className="StyleBox">
                    <p className="SignInText">Sign Up</p>
                    <FromGroup>
                      <span
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="firstName">First Name</label>
                        <PermIdentityIcon className="UserIcon" />
                        <input
                          name="firstName"
                          id="firstName"
                          placeholder="Enter First Name"
                          autoComplete="firstName"
                          className="Inputs"
                          onChange={handleChange}
                        />
                        {formErrors.firstName && (
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ marginTop: "4px" }}
                          >
                            {formErrors.firstName}
                          </Typography>
                        )}
                      </span>
                      <span
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="lastName" className="mt-3">
                          Last Name
                        </label>
                        <PermIdentityIcon
                          className="UserIcon"
                          style={{ top: "62px" }}
                        />
                        <input
                          name="lastName"
                          id="lastName"
                          placeholder="Enter Last Name"
                          autoComplete="lastName"
                          className="Inputs"
                          onChange={handleChange}
                        />
                        {formErrors.lastName && (
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ marginTop: "4px" }}
                          >
                            {formErrors.lastName}
                          </Typography>
                        )}
                      </span>
                      <span
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="email" className="mt-3">
                          Email
                        </label>
                        <PermIdentityIcon
                          className="UserIcon"
                          style={{ top: "62px" }}
                        />
                        <input
                          name="email"
                          id="email"
                          placeholder="Enter Email"
                          autoComplete="email"
                          className="Inputs"
                          onChange={handleChange}
                        />
                        {formErrors.email && (
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ marginTop: "4px" }}
                          >
                            {formErrors.email}
                          </Typography>
                        )}
                      </span>
                      <span
                        style={{
                          position: "relative",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <label htmlFor="hashPassword" className="mt-3">
                          Password
                        </label>
                        <LockIcon className="UserIcon" style={{ top: "62px" }} />
                        <input
                          name="hashPassword"
                          type={passwordVisible ? "text" : "Password"}
                          id="hashPassword"
                          placeholder="Enter Password"
                          autoComplete="Password"
                          className="Inputs"
                          onChange={handleChange}
                        />
                        <img
                          src={passwordVisible ? InvisibilityIcon : VisibilityIcon}
                          alt="Lock Icon"
                          style={{
                            top: "62px",
                            right: "16px",
                            left: "auto",
                            width: "19px",
                          }}
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="UserIcon"
                        />
                        {formErrors.hashPassword && (
                          <Typography
                            variant="caption"
                            color="error"
                            style={{ marginTop: "4px" }}
                          >
                            {formErrors.hashPassword}
                          </Typography>
                        )}
                      </span>
                    </FromGroup>
                    <button type="submit" className="btn btn-primary mt-5">
                      Sign Up
                    </button>
                    <div className="d-flex align-middle justify-content-center mt-5">
                      <p className="LableOfRemember m-0 mr-2">Already a Member?</p>
                      <Link
                        to="/signin"
                        className="NewSignUp btn btn-Normal text-warning p-0"
                      >
                        Sign In
                      </Link>
                    </div>
                  </StyleBox>
              </div>
              </StyleImage>
            </form>
          </styleDivMain>
        </PageLayoutContainer>
      </AppTheme>
    </div>
  );
}
