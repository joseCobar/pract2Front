import React, { useState, useContext } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import TextInput from "./TextInput.jsx";
import AuthContext from "../AuthContext.js";
import url from "../const.js";

const SignIn = ({ returnTo }) => {
  const { logIn, isLoggedIn } = useContext(AuthContext);

  const [formValues, setFormValues] = useState({ name: "" });

  if (isLoggedIn) return <Redirect to={returnTo} />;

  const handleInputChange = (event) => {
    const target = event.target;
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const queryExistence = `query{
      playerInfo(nickname:"${formValues.name}"){
        nickname
      }
    }`;
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({query: queryExistence})
    }).then(res=>res.json())
    .then(data=>{
      if(data.data.player == null){
        const mutation = `mutation{
          setPlayer(nickname:"${formValues.name}", rank:"bronze", email:"${formValues.name}@gmail.com"){
            nickname
            rank
            email
          }
        }`;
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({query: mutation})
        }).then(res=>res.json()).then(() => logIn(formValues))
      }else{
        logIn(formValues);
      }});
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        label="Name"
        name="name"
        value={formValues.name}
        onChange={handleInputChange}
      />
      <input type="submit" />
    </form>
  );
};
SignIn.propTypes = {
  returnTo: PropTypes.string.isRequired,
};

export default SignIn;
