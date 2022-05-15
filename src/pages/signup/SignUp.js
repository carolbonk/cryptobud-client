import React, {Component} from 'react';
import {Link, Redirect} from "react-router-dom";
import styles from './SignUp.module.scss';
import axios from "axios";
import Input from "../../components/input/Input";

class Signup extends Component {
    state = {
        error: "",
        success: false,
    };

    handleSubmit = (event) => {
        event.preventDefault();

        axios
            .post("http://localhost:8080/api/users/register", {
                email: event.target.email.value,
                password: event.target.password.value,
                first_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
                city: event.target.city.value,
                country: event.target.country.value,
            })
            .then(() => {
                this.setState({ success: true, error: "" });
                event.target.reset();
            })
            .catch((error) => {
                this.setState({ success: false, error: error.response.data });
            });
    };

    render() {
        return (
            <main className={styles.signupPage}>
                <form className={styles.signup} onSubmit={this.handleSubmit}>
                    <h1 className={styles.signup__title}>Sign up</h1>

                    <Input type="text" name="first_name" label="First name" />
                    <Input type="text" name="last_name" label="Last name" />
                    <Input type="text" name="city" label="City" />
                    <Input type="text" name="country" label="Country" />
                    <Input type="text" name="email" label="Email" />
                    <Input type="password" name="password" label="Password" />
                    <Input type="file" name="avatar" label="Upload avatar" />

                    <button className={styles.signup__button}>Sign up</button>

                    {this.state.success && <div className="signup__message">Signed up!</div>}
                    {this.state.error && <div className="signup__message">{this.state.error}</div>}
                </form>
                <p>
                    Have an account? <Link to="/">Log in</Link>
                </p>
            </main>
        );
    }
}

export default Signup;