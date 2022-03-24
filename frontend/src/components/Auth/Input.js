import { TextField, Grid, InputAdornment, IconButton } from "@material-ui/core";

const Input = ({ name, half }) => {
  return (
    <Grid item xs={12} sm={6}>
      <TextField
        name={name}
        onChange={handleChange}
        variant={outlined}
        required
        fullWidth
        label={label}
        autoFocus
        type={type}
        InputProps={name === 'password' ? {
            endAdornment : (
                <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword}>
                        {type === 'password' ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
            )
        }}
      />
    </Grid>
  );
};

e;

export default Input;
