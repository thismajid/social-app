import React, { useState, useEffect, useRef } from "react";
import useStyles from "./styles";
import { TextField, Button, Typography, Paper } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { createPost, updatePost } from "../../actions/posts";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Form = ({ currentId, setCurrentId }) => {
  const classes = useStyles();
  const [postData, setPostData] = useState({
    title: "",
    message: "",
    tags: "",
    image: "",
  });
  const dispatch = useDispatch();
  const post = useSelector((state) =>
    currentId ? state.posts.posts.find((post) => post.id === currentId) : null
  );
  const user = JSON.parse(localStorage.getItem("profile"));
  const history = useHistory();
  const fileInput = useRef();

  useEffect(() => {
    if (post) setPostData(post);
  }, [post]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", postData.title);
    formData.append("message", postData.message);
    formData.append("tags", postData.tags);
    formData.append("image", postData.image);

    if (currentId) {
      dispatch(updatePost(currentId, formData));
    } else {
      dispatch(createPost(formData, history));
    }

    clear();
  };

  if (!user?.result) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h6" align="center">
          Please login to create your own memories and likes other's memories
        </Typography>
      </Paper>
    );
  }

  const clear = () => {
    setCurrentId(null);
    setPostData({
      title: "",
      message: "",
      tags: "",
      image: "",
    });
  };

  return (
    <Paper className={classes.paper} elevation={6}>
      <form
        autoComplete="off"
        noValidate
        className={`${classes.root} ${classes.form}`}
        onSubmit={handleSubmit}
      >
        <Typography variant="h6">
          {currentId ? "Editing" : "Creating"} a Memory
        </Typography>
        <TextField
          name="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={postData.title}
          onChange={(e) => setPostData({ ...postData, title: e.target.value })}
        />
        <TextField
          name="message"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          rows={4}
          value={postData.message}
          onChange={(e) =>
            setPostData({ ...postData, message: e.target.value })
          }
        />
        <TextField
          name="tags"
          variant="outlined"
          label="Tags (coma separated)"
          fullWidth
          value={postData.tags}
          onChange={(e) =>
            setPostData({ ...postData, tags: e.target.value.split(",") })
          }
        />

        {/* <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setPostData({ ...postData, selectedFile: base64 })
            }
          /> */}
        <TextField
          type="file"
          name="image"
          ref={fileInput}
          onChange={(e) =>
            setPostData({ ...postData, image: e.target.files[0] })
          }
        />
        <Button
          className={classes.buttonSubmit}
          variant="contained"
          color="primary"
          size="large"
          type="submit"
          fullWidth
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={clear}
          fullWidth
        >
          Clear
        </Button>
      </form>
    </Paper>
  );
};

export default Form;
