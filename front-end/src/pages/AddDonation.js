import React from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function AddDonation() {
  const initialValues = {
    name: "",
    amount: "",
    ageRange: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Imię nie może być puste"),
    amount: Yup.number()
      .test("is-decimal", "Maksymalnie 2 miejsca po przecinku", (value) =>
        (value + "").match(/^(\d{1,5}|\d{0,5}\.\d{1,2})$/)
      )
      .required("Kwota nie może być pusta"),
      ageRange: Yup.string().required("Wybierz któryś z przedziałów")
  });

  const onSubmit = (data) => {
    axios
      .post("http://localhost:3001/donations", data, {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        navigate("/");
      });
  };

  let navigate = useNavigate();

  return (
    <div className="addDonationPage">
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form className="formContainer">
            <label>Imie: </label>
            <ErrorMessage name="name" component="span" />
            <Field
              className="formInput"
              name="name"
              placeholder=""
              type="text"
            />
            <label>Kwota: </label>
            <ErrorMessage name="amount" component="span" />
            <Field
              className="formInput"
              name="amount"
              placeholder=""
              type="number"
            />
            <label>Przedzial wiekowy: </label>
            <div role="group">
              <div class="ageRangeRadioButton">
                <label>
                  <Field type="radio" name="ageRange" value="19-31" />
                  19-31
                </label>
              </div>
              <div class="ageRangeRadioButton">  
                <label>
                  <Field type="radio" name="ageRange" value="31-100" />
                  31-100
                </label>
              </div>
              <div class="ageRangeRadioButton">  
                <label>
                  <Field type="radio" name="ageRange" value="0" />
                  Nie powiem :)
                </label>
              </div>  
            </div>
            <button type="submit">
              Wesprzyj!
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default AddDonation;
