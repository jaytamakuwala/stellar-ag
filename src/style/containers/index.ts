import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";

export const PageLayoutContainer = styled(Stack)(({ theme }) => ({
    background: "#000",
    padding: "0",
    margin: "0",
    marginTop: "0   px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    "& .AlignRightside" : {
        display: 'flex',
        width: '80%',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        zIndex: -1,
        inset: 0,
        backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
        ...theme.applyStyles("dark", {
            backgroundImage:
                "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
        }),
    },
    [theme.breakpoints.down('sm')]: {
        marginTop: "0px",
      },
    "& .MainDiv": {
        width: "80%",
        height: "100%",
        alignItems: "center",
        justifyContent: "space-between",
    },
    "& .UserIcon": {
        position: "absolute",
        top: "46px",
        color: "#000",
        left: "10px",
        fontSize: "18px",
    },
}));

export const StyleImage = styled(Stack)(({ theme }) => ({    
    "& .TopImg": {
        position: "fixed",
        top: "0",
        left: "0",
        right:"0",
        width: "100%;",
        height: "auto",
        objectFit: "cover",
        zIndex: "99",
    },
    "& .signinback": {
        position: "fixed",
        bottom: "0",
        left: "0",
        width: "100%;",
        height: "auto",
        objectFit: "cover",
        zindex: "-1",
    },
    "& .MainTopBox": {
        position: "relative",
        height: "100vh",
    },
    "& .AfterDiv": {
        marginTop: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: 'absolute',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
    },
    // "& .gradientOverlay": {
    //     position: 'fixed',
    //     top: '-88px',
    //     left: '0',
    //     right:'0',
    //     width: '100%',
    //     height: '133px',
    //     zIndex: '99',
    //     background: 'linear-gradient(to right, #282828 0%, #B24AF2 29%, #FF605D 68%, #282828 89%)',
    //     opacity:'0.3',
    //     borderBottomLeftRadius: '123%',
    //     borderBottomRightRadius: '108%',
    // },
    // "&::after": {
    //     content: '""',
    //     position: 'fixed',
    //     top: '33px',
    //     left: 0,
    //     width: '100%',
    //     height: '90px',
    //     background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0))',
    //     filter: 'blur(12px)',
    //     zIndex: 99,
    // }
    "@media (max-height: 900px)": {
        "& .MainTopBox": {
            marginTop:"50px",
            position: "relative",
            height: "auto",
        },
        "& .AfterDiv": {
            position: "relative",
            height: "auto",
        },
    }
}));
export const styleDivMain = styled(Stack)(({ theme }) => ({
    position: "relative",
    zIndex:"99"
}));
export const StyleDiv = styled(Stack)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    position: "relative",
    zIndex: "99",
    "& p, h1": {
        margin: "0",
    },
    "& img": {
        marginBottom: "30px",
        height: "70px",
    },
    "& .ShortIntro": {
        width: "343px",
        fontSize: "14px",
        paddingTop: "7px",
    },
    "& .WelcomeText": {
        fontSize: "28px",
        position: "relative",
        top: "8px",
    },
    "& .text-uppercase": {
        fontSize: "50px",
    },      
}));
export const StyleBox = styled(Stack)(({ theme }) => ({
    background: "rgba(256, 256, 256, 0.1)",
    width: "500px",
    padding: "45px",
    borderRadius: "10px",
    position: "relative",
    zIndex: "999",
    marginBottom:"80px",
    backdropFilter: "blur(5px)",
    height: "auto",
    "& .SignInText": {
        fontSize: "28px",
        fontWeight: "bold",
        marginTop: "0",
    },
}));
export const FromGroup = styled(Stack)(({ theme }) => ({
    "& label": {
        fontSize: "14px",
        paddingBottom: "3px",
    },
    "& .Inputs": {
        height: "45px",
        padding: "10px 35px",
        fontSize: "14px",
        borderRadius: "5px",
        border: "none",
    },
    "& .mt-3": {
        marginTop: "20px",
    },
    "& .remember-forgot": {
        display: "flex",
        paddingTop: "10px",
        alignItems: "center",
        justifyContent: "space-between",
        fontSize: "14px",
    },
    "& .remember-me": {
        position: "relative",
        marginTop: "5px",
    },
    "& .forgot-password": {
        color: "#fff",
        fontWeight: "normal",
        fontSize: "14px",
    },
    "& .CheckBoxRemember": {
        height: "17px",
        width: "17px",
        borderRadius: "13px",
        margin: "0",
        padding: "0",
        marginRight: "10px",
    },
    "& .LableOfRemember": {
        position: "relative",
        top: "-3px",
    },
}));
export const StyleModal = styled(Stack)(({ theme }) => ({ 
  display:'flex',
  position: 'fixed',
  zIndex:'9999',
  top:'0',
  bottom:'0',
  left:'0',
  right:'0',
  background: 'rgba(0,0,0,0.5)',
  alignItems: 'center',
  justifyContent: 'center',
  '& .InnerStyleModal': {
    display:'flex',
    width:'420px',
    height:'390px',
    background:'#2838cf',
    borderRadius:'10px',
    alignItems: 'center',
    justifyContent: 'center',    
    flexDirection: 'column',
    padding:'20px 50px',
    textAlign:'center',
  },
  '& .SignDark': {
    background: '#282828',
    borderColor: "#282828",
    padding:'10px 40px',
    fontSize:'12px',
  },
  '& .ShortIntroModal': {
    fontSize:'12px',
    marginTop:'5px',
  }
}));