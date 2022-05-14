import React, { Component } from "react";
import styles from "./NewPost.module.scss";
import axios from "axios";



export default class NewPost extends Component {

    componentDidMount() {

      }
      
      render() {
        return (
          <div className={styles.newPost}>
             <img></img>  
            <p>What's up?</p>
           <textarea maxLength="300" placeholder="Start Typing..." autofocus className={styles.newPost__message}></textarea>
           <button>Post</button>
          </div>
        );
      }
}