import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

function EditTransfer() {
  let { id } = useParams();
  const [donationObject, setDonationObject] = useState();

  useEffect(() => {
    axios.get(`http://localhost:3001/donations/id/${id}`).then((response) => {
      const data = response.data;
      setDonationObject(data);
    });
  }, [id]);

  const initialValues = {
    name: donationObject?.name,
    amount: donationObject?.amount,
    ageRange: donationObject?.ageRange
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Imię nie może być puste"),
    amount: Yup.number()
      .test("is-decimal", "Maksymalnie 2 miejsca po przecinku", (value) =>
        (value + "").match(/^(\d{1,5}|\d{0,5}\.\d{1,2})$/)
      )
      .required("Kwota nie może być pusta"),
    ageRange: Yup.string().required()
  });


  const onSubmit = (data) => {
    axios
      .put(`http://localhost:3001/donations/id/${id}`, data)
      .then((response) => {
        navigate("/");
        initialValues.signature = data.signature;
      });
  };

  let navigate = useNavigate();

  return (
    <div className="editDonationPage">
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        {(props) => (
          <Form className="formContainer">
            <label>Imię: </label>
            <ErrorMessage name="name" component="span" />
            <Field
              id="inputAddDonation"
              name="name"
              placeholder="Wprowadź imię"
            />
            <label>Kwota: </label>
            <ErrorMessage name="amount" component="span" />
            <Field
              id="inputAddDonation"
              name="amount"
              placeholder="Wprowadź kwotę"
            />
            <div>
            </div>
            <button type="submit">
              Popraw!
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditTransfer;
