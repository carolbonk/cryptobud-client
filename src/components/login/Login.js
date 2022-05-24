import "./Login.scss";
import { Component } from "react";
import Input from "../../components/input/Input";

class Login extends Component {
  render() {
    return (
      <form className="login" onSubmit={this.props.onLogIn}>
        <h1 className="login__title">Log in</h1>

        <Input type="text" name="email" label="Email" />
        <Input type="password" name="password" label="Password" />

        <div className="login__buttonContainer">
          <button className="login__button">Log in</button>
        </div>
      </form>
    );
  }
}

export default Login;
