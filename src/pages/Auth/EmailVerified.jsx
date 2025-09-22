import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "../AppTheme";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

// Assets
import logoImg from "../../assets/Images/logoImg.png";
import signinback from "../../assets/Images/signinback.svg";
import bottomImage from "../../assets/Images/bottomImage.png";
import LockIcon from "../../assets/Images/lock.png";
import VisibilityIcon from "../../assets/Images/visibility.png";
import InvisibilityIcon from "../../assets/Images/invisibility.png";
import CheckIcon from "../../assets/Images/CheckIcon.png";

// Services
import { emailVerified, verifyEmail } from "../../service/stellarApi";

// React Router
import { Link, useNavigate } from "react-router-dom";

// Styles
import {
  PageLayoutContainer,
  FromGroup,
  StyleBox,
  StyleDiv,
  StyleImage,
  StyleModal,
} from "../../style/containers";

// MUI
import { Typography } from "@mui/material";

// Utils
import { validateFormData } from "../../utils/common";

// Toast
import toast from "react-hot-toast";

// Components
import Header from "../Header";

export default function EmailVerified(props) {
  const [signUpSuccess, setSignUpSuccess] = React.useState(false);
  const [formDetails, setFormDetails] = React.useState({
    email: "",
    otp: "",
  });
  const [otpVisible, setOtpVisible] = React.useState(false);
  const [formErrors, setFormErrors] = React.useState(formDetails);
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
    await emailVerified(formDataObj)
      .then((res) => {
        if (res.ok) {
          toast.success(res.data);
          setSignUpSuccess(true);
          // navigate("/signin");
          return;
        } else {
          setSignUpSuccess(false);
          toast.error(res.error);
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message || "Something went wrong");
      });
  };

  const resendMail = async () => {
    if (!formDetails.email) {
      setFormErrors({ ...formErrors, email: "Email is required" });
      return;
    }
    await verifyEmail({ email: formDetails.email })
      .then((res) => {
        toast.success(res.data);
      })
      .catch((error) => {
        console.log({ error });
        toast.error(res.error);
      });
  };
  return (
    <>
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
              <img src={signinback} alt="My File" className="signinback" />
              <div className="AfterDiv">
                <StyleDiv className="StyleDiv">
                  <div>
                    <img src={logoImg} alt="My File" />
                  </div>
                </StyleDiv>
                <StyleBox className="StyleBox">
                  <p className="SignInText">Email Verified</p>
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
                      <label htmlFor="otp" className="mt-3">
                        OTP
                      </label>
                      <img
                        src={LockIcon}
                        alt="Lock Icon"
                        style={{ top: "62px", width: "19px" }}
                        className="UserIcon"
                      />
                      <input
                        type={otpVisible ? "text" : "password"}
                        id="otp"
                        name="otp"
                        placeholder="Enter otp"
                        autoComplete="password"
                        className="Inputs"
                        onChange={handleChange}
                      />
                      <img
                        src={otpVisible ? InvisibilityIcon : VisibilityIcon}
                        alt="Lock Icon"
                        style={{
                          top: "62px",
                          right: "16px",
                          left: "auto",
                          width: "19px",
                        }}
                        onClick={() => setOtpVisible(!otpVisible)}
                        className="UserIcon"
                      />
                      {formErrors.otp && (
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ marginTop: "4px" }}
                        >
                          {formErrors.otp}
                        </Typography>
                      )}
                    </span>
                  </FromGroup>
                  <button type="submit" className="btn btn-primary mt-5">
                    <span style={{ position: "relative" }}>Continue</span>
                  </button>
                  <div className="d-flex align-middle justify-content-center mt-5">
                    <p
                      onClick={() => resendMail()}
                      className="LableOfRemember m-0 mr-2"
                    >
                      Resend Mail
                    </p>
                  </div>
                </StyleBox>
              </div>
            </StyleImage>
          </form>
        </styleDivMain>
      </PageLayoutContainer>

      {signUpSuccess ? (
        <StyleModal>
          <div className="InnerStyleModal">
            <img src={CheckIcon} alt="CheckIcon" />
            <h1>Congratulations !</h1>
            <p className="ShortIntroModal">
              Lorem Ipsum is simply dummy text of the printing and Lorem Ipsum
              is Lorem Ipsum is Lorem Ipsum is Lorem Ipsum is simply dummy text
              of the printing and Lorem Ipsum is simply
            </p>
            <Link to="/signin" className="btn btn-dark SignDark">
              Sign In
            </Link>
          </div>
        </StyleModal>
      ) : (
        ""
      )}
    </>
  );
}
