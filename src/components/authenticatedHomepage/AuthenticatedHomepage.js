import React, { Component } from "react";
import { Link} from "react-router-dom";
import styles from "./AuthenticatedHomepage.module.scss";
import axios from "axios";
import NewPost from "../newPost/NewPost.js";
import Post from "../post/Post.js";
import Comment from "../comment/Comment.js";
import Header from "../header/Header.js";
import InfiniteScroll from "react-infinite-scroll-component";

export default class AuthenticatedHomepage extends Component {

    componentDidMount() {

      }
      
    

      render() {
        let posts = null;
        if (!!this.props.posts)
        {
        posts = this.props.posts.map(post => {
         return(
          <div key={post.id}  className={styles.homePage__postWrapper}>
          <Post key={post.id} avatar={post.avatar_url} firstName={post.first_name} lastName={post.last_name} message={post.message} date={post.date}/>
          </div>
         )
       }) }
        return (

          <>
        
          <Header onLogOut={this.props.onLogOut}/>
          <main className={styles.homePage}>
            <div className={styles.homePage__feed}> 
           <NewPost  onMessageSubmit={this.props.onMessageSubmit} onGlobalToggleChange={this.props.onGlobalToggleChange} globalToggle={this.props.globalToggle} userFirstName={this.props.userFirstName} userLastName={this.props.userLastName} userAvatar={this.props.userAvatar} onMessageChange={this.props.onMessageChange} messageCharCount={this.props.messageCharCount} />   

           <InfiniteScroll
          dataLength={this.props.numberOfPosts}
          next={() => {this.props.getPosts(false);}}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
           {posts}

           </InfiniteScroll>
           </div>
         
          </main>
          
          </> );

      }
}