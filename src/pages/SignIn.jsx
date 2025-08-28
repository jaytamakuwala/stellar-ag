import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./AppTheme";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import logoImg from "../assets/Images/logoImg.png";
import signinback from "../assets/Images/signinback.svg";
import LockIcon from "../assets/Images/lock.png";
import VisibilityIcon from "../assets/Images/visibility.png";
import Invisibility from "../assets/Images/invisibility.png";
import bottomImage from "../assets/Images/bottomImage.png";
import { Link } from "react-router-dom";
import { logIn } from "../service/stellarApi";
import {
  PageLayoutContainer,
  FromGroup,
  StyleBox,
  StyleDiv,
  StyleImage,
} from "../style/containers";
import { validateFormData } from "../utils/common";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "./Header";
import { useState } from "react";

export default function SignIn(props) {
  const [formDetails, setFormDetails] = useState({
    email: "",
    hashPassword: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState(formDetails);

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
    await logIn(formDataObj)
      .then((res) => {
        if (res.ok) {
          sessionStorage.setItem("token", res.data.token);
          toast.success(res.data?.message);
          navigate("/");
          return;
        }
        toast.error(res.error);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ height: "100vh" }}>
      <AppTheme {...props}>
        {" "}
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
                  <div className="MainTopBox">
                    <div className="AfterDiv">
                    <StyleDiv className="StyleDiv">
                      <div>
                        <img src={logoImg} alt="My File" />
                      </div>
                    </StyleDiv>
                    <StyleBox className="StyleBox">
                      <p className="SignInText">Sign In</p>
                      <FromGroup>
                        <span
                          style={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <label htmlFor="email">Email</label>
                          <PermIdentityIcon className="UserIcon" />
                          <input
                            type="email"
                            id="email"
                            placeholder="Enter Email"
                            autoComplete="email"
                            className="Inputs"
                            name="email"
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
                          <img
                            src={LockIcon}
                            alt="Lock Icon"
                            style={{ top: "62px", width: "19px" }}
                            className="UserIcon"
                          />
                          <input
                            type={passwordVisible ? "text" : "Password"}
                            id="hashPassword"
                            name="hashPassword"
                            placeholder="Enter Password"
                            autoComplete="password"
                            className="Inputs"
                            onChange={handleChange}
                          />
                          <img
                            src={passwordVisible ? Invisibility : VisibilityIcon}
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
                        <div className="remember-forgot">
                          <div className="remember-me">
                            <input
                              type="checkbox"
                              id="remember"
                              className="CheckBoxRemember"
                            />
                            <label htmlFor="remember" className="LableOfRemember m-0">
                              Remember me
                            </label>
                          </div>
                          <a href="/forgotPassword" className="forgot-password">
                            Forgot password?
                          </a>
                        </div>
                      </FromGroup>
                      <button type="submit" className="btn btn-primary mt-3">
                        <span style={{ position: "relative" }}>
                          Sign In
                        </span>
                      </button>
                      <div className="d-flex align-middle justify-content-center mt-5">
                        <p className="LableOfRemember m-0 mr-2">New User?</p>
                        <Link
                          to="/signup"
                          className="NewSignUp btn btn-Normal text-warning p-0"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </StyleBox>
                  </div>
                </div>
              </StyleImage>
            </form>
          </styleDivMain>
        </PageLayoutContainer>
      </AppTheme>
    </div>
  );
}
