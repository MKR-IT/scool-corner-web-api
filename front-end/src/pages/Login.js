import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../helpers/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Login() {
  const { setAuthState } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  let navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("Nazwa użytkownika nie może być pusta"),
    password: Yup.string().required("Hasło nie może być pusta"),
  });

  const onSubmit = () => {
    const data = {
      username: username,
      password: password,
    };

    axios.post("http://localhost:3001/auth/login", data).then((response) => {
      if (response.data.error) {
        alert(response.data.error);
      } else {
        localStorage.setItem("accessToken", response.data);
        setAuthState(true);
        navigate("/");
      }
    });
  };

  return (
    <div className="loginPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        enableReinitialize
      >
        {(props) => (
          <Form className="formContainer" autoComplete="off">
            <Field type="text" name="fake" style={{ display: "none" }} />
            <label>Nazwa użytkownika:</label>
            <ErrorMessage name="username" component="span" />
            <Field
              autoComplete="new-password"
              className="formInput"
              name="username"
              placeholder="Wprowadź nazwę użytkownika"
              type="text"
              onChange={(event) => {
                setUsername(event.target.value);
                props.handleChange(event); // Update Formik state
              }}
            />
            <label>Hasło:</label>
            <ErrorMessage name="password" component="span" />
            <Field
              autoComplete="new-password"
              className="formInput"
              name="password"
              placeholder="Wprowadź hasło"
              type="password"
              onChange={(event) => {
                setPassword(event.target.value);
                props.handleChange(event); // Update Formik state
              }}
            />
            <button type="submit">Login</button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
