import React, { Component } from "react";
import { Link} from "react-router-dom";
import styles from "./AuthenticatedHomepage.module.scss";
import axios from "axios";
import NewPost from "../newPost/NewPost.js";
import Post from "../post/Post.js";
import Comment from "../comment/Comment.js";
import Header from "../header/Header.js";

export default class AuthenticatedHomepage extends Component {

    componentDidMount() {

      }
      
    

      render() {
       
        return (


          <>
        
          <Header onLogOut={this.props.onLogOut}/>
          <main className={styles.homePage}>
            <div className={styles.homePage__feed}> 
           <NewPost  onGlobalToggleChange={this.props.onGlobalToggleChange} globalToggle={this.props.globalToggle} userFirstName={this.props.userFirstName} userLastName={this.props.userLastName} userAvatar={this.props.userAvatar} onMessageChange={this.props.onMessageChange} messageCharCount={this.props.messageCharCount} />   
           <div className={styles.homePage__postWrapper}>
           <Post firstName="Victor" lastName="Fry" message="Short message" date="05/13/2022"/>
           </div>
           <Comment firstName="Victor" lastName="Fry" message="Short message" date="05/13/2022"/>
           <Comment firstName="Victor" lastName="Fry2" message="Short message" date="05/13/2022"/>
           <div className={styles.homePage__postWrapper}>
           <Post firstName="Victor" lastName="Fry3" message="Short message" date="05/13/2022"/>
           </div>
           <div className={styles.homePage__postWrapper}>
           <Post firstName="Victor" lastName="Fry44" message="Short message" date="05/13/2022"/>
           </div>
           </div>
         
          </main>
          
          </> );

      }
}