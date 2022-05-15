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
           <div className={styles.newPost__commentCount}>
             <span id="current">0</span>
             <span id="maximum">/300</span>
           </div>
           <div className={styles.newPost__btnContainer}>
           <button className={styles.newPost__button}>Post</button>
           </div>
          </div>
        );
      }
}