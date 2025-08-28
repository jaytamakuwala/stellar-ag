import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./AppTheme";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import logoImg from "../assets/Images/logoImg.png";
import signinback from "../assets/Images/signinback.svg";
import bottomImage from "../assets/Images/bottomImage.png";
import LockIcon from "../assets/Images/lock.png";
import VisibilityIcon from "../assets/Images/visibility.png";
import InvisibilityIcon from "../assets/Images/invisibility.png";
import { resetPassword } from "../service/stellarApi";
import {
  PageLayoutContainer,
  FromGroup,
  StyleBox,
  StyleDiv,
  StyleImage,
} from "../style/containers";
import { validateFormData } from "../utils/common";
import { Typography } from "@mui/material";
import toast from "react-hot-toast";
import Header from "./Header";

export default function ResetPassword(props) {
  const [formDetails, setFormDetails] = React.useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [visibility, setVisibility] = React.useState({
    otp: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [formErrors, setFormErrors] = React.useState(formDetails);

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
    await resetPassword(formDataObj)
      .then((res) => {
        console.log({ res });
        if (res.ok) {
          toast.success(res.data);
          return;
        } else toast.error(res.error);
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message || "Something went wrong");
      });
  };

  return (
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
              <div className="AfterDiv">
                  <StyleDiv className="StyleDiv">
                  <div>
                    <img src={logoImg} alt="My File" />
                  </div>
                </StyleDiv>
                <StyleBox className="StyleBox">
                  <p className="SignInText">Reset Password</p>
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
                        type={visibility.otp ? "text" : "password"}
                        id="otp"
                        name="otp"
                        placeholder="Enter OTP"
                        autoComplete="password"
                        className="Inputs"
                        onChange={handleChange}
                      />
                      <img
                        src={visibility.otp ? InvisibilityIcon : VisibilityIcon}
                        alt="Lock Icon"
                        style={{
                          top: "62px",
                          right: "16px",
                          left: "auto",
                          width: "19px",
                        }}
                        className="UserIcon"
                        onClick={() =>
                          setVisibility({ ...visibility, otp: !visibility.otp })
                        }
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
                    <span
                      style={{
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <label htmlFor="newPassword" className="mt-3">
                        New Password
                      </label>
                      <img
                        src={LockIcon}
                        alt="Lock Icon"
                        style={{ top: "62px", width: "19px" }}
                        className="UserIcon"
                      />
                      <input
                        type={visibility.newPassword ? "text" : "password"}
                        id="newPassword"
                        name="newPassword"
                        placeholder="Enter new password"
                        autoComplete="password"
                        className="Inputs"
                        onChange={handleChange}
                      />
                      <img
                        src={
                          visibility.newPassword ? InvisibilityIcon : VisibilityIcon
                        }
                        alt="Lock Icon"
                        style={{
                          top: "62px",
                          right: "16px",
                          left: "auto",
                          width: "19px",
                        }}
                        className="UserIcon"
                        onClick={() =>
                          setVisibility({
                            ...visibility,
                            newPassword: !visibility.newPassword,
                          })
                        }
                      />
                      {formErrors.newPassword && (
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ marginTop: "4px" }}
                        >
                          {formErrors.newPassword}
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
                      <label htmlFor="confirmPassword" className="mt-3">
                        Confirm Password
                      </label>
                      <img
                        src={LockIcon}
                        alt="Lock Icon"
                        style={{ top: "62px", width: "19px" }}
                        className="UserIcon"
                      />
                      <input
                        type={visibility.confirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Enter confirm password"
                        autoComplete="password"
                        className="Inputs"
                        onChange={handleChange}
                      />
                      <img
                        src={
                          visibility.confirmPassword
                            ? InvisibilityIcon
                            : VisibilityIcon
                        }
                        alt="Lock Icon"
                        style={{
                          top: "62px",
                          right: "16px",
                          left: "auto",
                          width: "19px",
                        }}
                        className="UserIcon"
                        onClick={() =>
                          setVisibility({
                            ...visibility,
                            confirmPassword: !visibility.confirmPassword,
                          })
                        }
                      />
                      {formErrors.confirmPassword && (
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ marginTop: "4px" }}
                        >
                          {formErrors.confirmPassword}
                        </Typography>
                      )}
                    </span>
                  </FromGroup>
                  <button type="submit" className="btn btn-primary mt-5">
                    <span style={{ position: "relative", }}>Continue</span>
                  </button>
                </StyleBox>
              </div>
            </StyleImage>
          </form>
        </styleDivMain>
      </PageLayoutContainer>
    </AppTheme>
  );
}
