import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
  TextField,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOpenOutlined";

import useStyles from "./styles";

const Auth = () => {
  const classes = useStyles();

  const isRegister = false;

  const handleSubmit = () => {};

  const handleChange = () => {};

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant="h5">
          {isRegister ? "Register" : "Login"}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isRegister && (
              <>
                <Grid xs={6} md={12}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    xs={6}
                  />
                </Grid>
                <Grid xs={6} md={12}>
                  <TextField
                    name="firstName"
                    label="First Name"
                    handleChange={handleChange}
                    autoFocus
                    xs={6}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Auth;
