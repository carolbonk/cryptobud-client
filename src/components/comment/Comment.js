import React, { Component } from "react";
import styles from "./Comment.module.scss";
import axios from "axios";



export default class Comment extends Component {

    componentDidMount() {

      }
      
      render() {
            return (
                <div className={styles.comment}>
                    <img></img>
                    <div><p>Comment {this.props.date}</p></div>
                    <label>{this.props.firstName + " " + this.props.lastName}</label>
                    <p>{this.props.message}</p>
                 </div>
               );}      
}