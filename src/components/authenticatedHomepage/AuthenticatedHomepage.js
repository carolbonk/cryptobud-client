import React, { Component } from "react";
import { Link} from "react-router-dom";
import styles from "./AuthenticatedHomepage.module.scss";
import axios from "axios";
import NewPost from "../newPost/NewPost.js";
import Post from "../post/Post.js";
import Comment from "../comment/Comment.js";

export default class AuthenticatedHomepage extends Component {

    componentDidMount() {

      }
     
      render() {
       
        return (
          <main className={styles.homePage}>

            <div className={styles.homePage__feed}> 
           <NewPost/>   
           <Post firstName="Victor" lastName="Fry" message="Short message" date="05/13/2022"/>
           <Comment firstName="Victor" lastName="Fry" message="Short message" date="05/13/2022"/>
           <Comment firstName="Victor" lastName="Fry" message="Short message" date="05/13/2022"/>
           <Post firstName="Enrique" lastName="Espinoza" message="longer message adadadadadada daddadaddada adadadadadaa  ddadadada daadadadadadada dadadadadadadadada  aaa" date="05/13/2022"/>
           <Post firstName="Mike" lastName="Smith" message="Short message" date="05/13/2022"/>
           </div> 
         
          </main>
        );
      }
}