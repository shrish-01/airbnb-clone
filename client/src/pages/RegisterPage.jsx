/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";

const RegisterPage = () => {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // function registerUser(ev) {
  //   ev.preventDefault();
  //   axios.post('http://localhost:4000/register', {
  //     firstName,
  //     lastName,
  //     email,
  //     password,
  //   }).then((data) => {
  //     console.log(data);
  //   }).catch((err) => {
  //     console.log(err.message);
  //   });
  // }

  const register = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/register", {
      method: "POST",
      body: JSON.stringify({ firstName, lastName, email, password }),
      headers: { "Content-Type": "application/json" },
    });
    // if (response.status !== 200) {
    //   alert("Registration failed!");
    // } else {
    //   alert("Registration successful!");
    // }
  };

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={register}>
          <div className="flex">
            <input className="mr-1"
              type="text"
              placeholder="first name"
              value={firstName}
              onChange={ev => setFirstName(ev.target.value)} />
            <input className="ml-1"
              type="text"
              placeholder="last name"
              value={lastName}
              onChange={ev => setLastName(ev.target.value)} />
          </div>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={ev => setEmail(ev.target.value)} />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={ev => setPassword(ev.target.value)} />
          <button className="primary">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member? <Link className="underline text-gray-800" to={"/login"} >Login here!</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RegisterPage