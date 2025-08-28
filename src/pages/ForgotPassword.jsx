import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import AppTheme from "./AppTheme";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import logoImg from "../assets/Images/logoImg.png";
import signinback from "../assets/Images/signinback.svg";
import bottomImage from "../assets/Images/bottomImage.png";
import { forgotPassword } from "../service/stellarApi";
import {
  PageLayoutContainer,
  FromGroup,
  StyleBox,
  StyleDiv,
  StyleImage,
} from "../style/containers/index";
import { validateFormData } from "../utils/common";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Header from "./Header";

export default function ForgotPassword(props) {
  const [formDetails, setFormDetails] = React.useState({
    email: "",
  });
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
    await forgotPassword(formDataObj)
      .then((res) => {
        if(res.ok){
          toast.success(res.data)
        navigate("/resetPassword");
        return
        }
        else toast.error(res.error)
      })
      .catch((error) => {
        console.log(error);
        toast.error(error?.message || 'Something went wrong')
      });
  };

  return (
  <div style={{height:"100vh"}}>
        <AppTheme {...props}>
      {" "}
      <CssBaseline enableColorScheme />
      <PageLayoutContainer
        className="PageLayoutContainer"
        direction="column"
        justifyContent="space-between"
        style={{display:'flex', flexDirection:"column"}}
      >
        <div className="AlignRightside"> <Header /></div>
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
                    <p className="SignInText">Forgot Password</p>
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
                      </span>
                      {formErrors.email && (
                        <Typography
                          variant="caption"
                          color="error"
                          style={{ marginTop: "4px" }}
                        >
                          {formErrors.email}
                        </Typography>
                      )}
                    </FromGroup>

                    <button type="submit" className="btn btn-primary mt-5">
                      <span style={{ position: "relative",}}>Continue</span>
                    </button>
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
