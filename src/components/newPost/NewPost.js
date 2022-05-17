import React, { Component } from "react";
import styles from "./NewPost.module.scss";
import axios from "axios";



export default class NewPost extends Component {

    componentDidMount() {

      }
      
      render() {
        return (
          <div className={styles.newPost}>
            <div className={styles.newPost__header}>
             <img className={styles.newPost__avatar} src={this.props.userAvatar}></img>  
            <p>Hey {this.props.userFirstName}, What's up?</p>
            </div>
            <form className={styles.newPost__form} onSubmit={this.props.onMessageSubmit}>
           <textarea name="message" onChange={this.props.onMessageChange} maxLength="300" placeholder="Start Typing..." className={styles.newPost__message}></textarea>
           <div className={styles.newPost__commentCount}>
             <span id="current">{this.props.messageCharCount}</span>
             <span id="maximum">/300</span>
           </div>
           <div className={styles.newPost__funcContainer}>
           <button type="submit" className={styles.newPost__button}>Post</button>
           <div className={styles.newPost__toggleBar}>

           <p className={styles.newPost__globalText}>Global</p>
           <a onClick={this.props.onGlobalToggleChange} href="#" className={styles.newPost__toggle + " " + (this.props.globalToggle ? styles.newPost__toggleGlobal : styles.newPost__toggleCluster)}></a>
           <p className={styles.newPost__clusterText}>Cluster only</p>
           </div>

           </div>

           </form>
          </div>
        );
      }
}