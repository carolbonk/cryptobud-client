import React, { Component } from "react";
import styles from "./NewPost.module.scss";
import axios from "axios";
import Input from "../../components/input/Input";


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
           <Input type="file" name="image" label="Upload image" />
           <div className={styles.newPost__funcContainer}>
           <div className={styles.newPost__toggleBar}>

           <div className={styles.newPost__toggleContainer}>
           <p className={styles.newPost__globalText}>GLOBAL</p>
           <a onClick={this.props.onGlobalToggleChange} href="#" className={styles.newPost__toggle + " " + (this.props.globalToggle ? styles.newPost__toggleGlobal : styles.newPost__toggleCluster)}></a>
           <p className={styles.newPost__clusterText}>CLUSTER ONLY</p>
           </div>
           </div>
        
           <button type="submit" className={styles.newPost__postButton}>Post</button>
           </div>

           </form>
          </div>
        );
      }
}