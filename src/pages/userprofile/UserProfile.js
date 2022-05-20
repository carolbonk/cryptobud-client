import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import styles from "./UserProfile.module.scss";
import axios from "axios";
import Footer from "../../components/footer/Footer.js";
import Login from "../../components/login/Login.js";
import { Particle } from 'jparticles'
import UnauthenticatedLanding from "../../components/unauthenticatedLanding/UnauthenticatedLanding";
import AuthenticatedHomepage from "../../components/authenticatedHomepage/AuthenticatedHomepage";
import Post from "../../components/post/Post.js";
import Comment from "../../components/comment/Comment.js";
import Header from "../../components/header/Header.js";
import InfiniteScroll from "react-infinite-scroll-component";

export default class UserProfile extends Component {
  
  state = {
    user: null,
    messageCharCount:0,
    posts:[], 
    lastTopIndex:0,
    numberOfPosts:0,
    morePosts:true,
    currentProfile: null
};


handleLogout = () => {
  sessionStorage.removeItem("token");
  this.setState({
      user: null,
      posts:[],
      lastTopIndex:0
  });
};

  
  componentDidMount() {

    axios
            .get('http://localhost:8080/users/current', {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then((response) => {      
              this.setState({
                user: response.data
            }, () => {this.getPosts();
              this.getProfile()});
           
              })  
            .catch(() => {
                this.setState({
                    failedAuth: true
                })
            });

   //this.getPosts();

    setInterval(
      this.refreshPosts, 5000);
  }

  getProfile = () => {
    axios
    .get('http://localhost:8080/users/id/' + this.props.match.params.user_id, {
        headers: {
            Authorization: 'Bearer ' + sessionStorage.getItem('token')
        }
    })
    .then((response) => {     
      console.log(response.data); 
      this.setState({
       
        currentProfile: response.data
    });
   
      })  
    .catch(() => {
        this.setState({
            failedAuth: true
        })
    });
 
  }

  refreshPosts = () => {

    if (!!this.state.user)
    {
    if (!sessionStorage.getItem('token')) {
      this.setState({ failedAuth: true });
      return;
    }

    var config = {
      method: 'get',
      url: ('http://localhost:8080/posts?from=0&to=10'+ "&user_id=" + this.props.match.params.user_id),
      headers: { 
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    };
    axios(config)
    .then((response) => {
      let currentPosts = this.state.posts;
    
      let incomingPosts = response.data.posts;

      let postsToAdd = incomingPosts.filter((incomingPost) =>{
        return !(currentPosts.find((currentPost) => {return (currentPost.id === incomingPost.id);}));
      });

      let posts = postsToAdd.concat(currentPosts);

      this.setState({lastTopIndex: (this.state.lastTopIndex + postsToAdd.length),
        posts: posts});

    });
  }
  };

  getPosts = () => {

    if (!!this.state.user)
    {
    if (!sessionStorage.getItem('token')) {
      this.setState({ failedAuth: true });
      return;
    }
    
    let from = this.state.lastTopIndex;
    let to = from + 10;
    console.log("from " + from + " to " + to); 
    var config = {
      method: 'get',
      url: ('http://localhost:8080/posts?from=' + from + "&to=" + 10 + "&user_id=" + this.props.match.params.user_id),
      headers: { 
        'Authorization': 'Bearer ' + sessionStorage.getItem('token')
      }
    };
    
    axios(config)
    .then((response) => {
    
        let currentPosts = this.state.posts;
        console.log(currentPosts);
        console.log(response.data.posts);
         let newPosts = currentPosts.concat(response.data.posts);
        console.log("new ");
        console.log(newPosts);
        let morePosts = true;
        if (newPosts.length < currentPosts.length + 10)
        {
          morePosts =false;
        }
        let nextLastTopIndex = to + 1;
        console.log("Number of posts " + newPosts.length);
        this.setState({lastTopIndex: nextLastTopIndex,
          posts: newPosts,
        morePosts: morePosts});

    
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  }

  

  handleToggleChange = () => {
    let currentToggle = this.state.globalToggle;
    this.setState({
      globalToggle: (!currentToggle)
    });
  }
  
  render() {
    let posts = null;

    if (!!this.state.posts)
    {
    posts = this.state.posts.map(post => {
     return(
      <div key={post.id}  className={styles.homePage__postWrapper}>
      <Post key={post.id} avatar={post.avatar_url} firstName={post.first_name} lastName={post.last_name} message={post.message} date={post.date} global={post.global}/>
      </div>
     )
   }) }
     
   if (!!this.state.currentProfile)
   {
    return (
      <>
    
      <Header onLogOut={this.handleLogout}/>
      <main className={styles.homePage}>
        <div className={styles.homePage__feed}> 
       
       <div className={styles.homePage__currentProfile}>
         <img className={styles.homePage__avatar} src={this.state.currentProfile.avatar_url}></img>
         <h1>
       {this.state.currentProfile.first_name + " " + this.state.currentProfile.last_name}
       </h1>
       </div>

       <InfiniteScroll
      dataLength={this.state.posts.length}
      next={() => {console.log("number of posts in data length: " + this.state.numberOfPosts);
      this.getPosts();}}
      hasMore={this.state.morePosts}
      loader={<h4>Loading...</h4>}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>wow, you have seen it all!</b>
        </p>
      }
    >
       {posts}

       </InfiniteScroll>
       </div>
     
      </main>
      </>
    );}
    else
    {
      return;
    }
}
}
