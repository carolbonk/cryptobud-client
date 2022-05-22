import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import styles from "./Comments.module.scss";
import axios from "axios";
import Footer from "../../components/footer/Footer.js";
import Login from "../../components/login/Login.js";
import { Particle } from 'jparticles'
import Post from "../../components/post/Post.js";
import Comment from "../../components/comment/Comment.js";
import Header from "../../components/header/Header.js";

export default class Comments extends Component {
    render() {
        return (
    <>
    <Header/>
    {this.props.match.params.post_id}
    </>);
    }
}