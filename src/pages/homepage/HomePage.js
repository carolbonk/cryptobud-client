import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import styles from "./HomePage.module.scss";
import axios from "axios";
import Footer from "../../components/footer/Footer.js";
import Login from "../../components/login/Login.js";
import { Particle } from 'jparticles'
import UnauthenticatedLanding from "../../components/unauthenticatedLanding/UnauthenticatedLanding";
import AuthenticatedHomepage from "../../components/authenticatedHomepage/AuthenticatedHomepage";

export default class HomePage extends Component {
  
  state = {
    user: null,
    messageCharCount:0,
    globalToggle: true,
    posts:[], 
    lastTopIndex:0,
    numberOfPosts:0,
    morePosts:true
};

handlePostMessageChange = (event) => {
  this.setState({
    messageCharCount: event.target.value.length});
};

handlePostMessageSubmit = (event) => {
  console.log("here 1");
  event.preventDefault();

  let data = {
   message: event.target.message.value,
   global: this.state.globalToggle
  };

  var config = {
    method: 'post',
    url: 'http://localhost:8080/posts',
    headers: { 
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    },
    data : data
  };
  
  console.log("here");

  axios(config)
  .then((response) => {

    event.target.message.value = '';
    console.log(response);
    this.setState({
      messageCharCount:0
    }, this.refreshPosts);


  })
  .catch(function (error) {
    console.log(error);
  });

};

handleLogout = () => {
  sessionStorage.removeItem("token");
  this.setState({
      user: null,
      posts:[],
      lastTopIndex:0
  });
}; 


  handleLogInSubmit = (event) => {
    event.preventDefault();

    axios
        .post('http://localhost:8080/users/login', {
            email: event.target.email.value,
            password: event.target.password.value
        })
        .then((response) => {
            sessionStorage.setItem("token", response.data.token);
            axios
            .get('http://localhost:8080/users/current', {
                headers: {
                    Authorization: 'Bearer ' + response.data.token
                }
            })
            .then((response) => {

             /* this.setState({
                user: response.data}); */
              
              this.setState({
                user: response.data
            }, () => {this.getPosts()});
           
           
             
               
              })  
            .catch(() => {
                this.setState({
                    failedAuth: true
                })
            });
        })
        .catch((error) => {
            this.setState({ error: error.response.data });
        });
  }

  componentDidMount() {

    if (!!sessionStorage.getItem('token'))
    {
    axios
            .get('http://localhost:8080/users/current', {
                headers: {
                    Authorization: 'Bearer ' + sessionStorage.getItem('token')
                }
            })
            .then((response) => {      
              this.setState({
                user: response.data
            }, () => {this.getPosts()});
           
              })  
            .catch(() => {
                this.setState({
                    failedAuth: true
                })
            });
        }
    new Particle('#background',
    {
      color: '#25bfff',
      lineShape: 'cube',
      range: 2000,
      proximity: 100,
      parallax: true,
    });

   
    setInterval(
      this.refreshPosts, 5000);
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
      url: ('http://localhost:8080/posts?from=0&to=10'),
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
      url: ('http://localhost:8080/posts?from=' + from + "&to=" + 10),
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

  handleRefresh = () =>{
    console.log("I'm in the refresh");
   this.getPosts();
  };

  handleToggleChange = () => {
    let currentToggle = this.state.globalToggle;
    this.setState({
      globalToggle: (!currentToggle)
    });
  }
  
  render() {
    return (
      <>
    { !this.state.user ? <UnauthenticatedLanding onLogIn={this.handleLogInSubmit}/> : (this.state.posts.length != 0 ? (<AuthenticatedHomepage onRefresh={this.handleRefresh} numberOfPosts={this.state.posts.length} getPosts={this.getPosts} onMessageSubmit={this.handlePostMessageSubmit} morePosts={this.state.morePosts} posts={this.state.posts} onGlobalToggleChange={this.handleToggleChange} globalToggle={this.state.globalToggle} onMessageChange={this.handlePostMessageChange} messageCharCount={this.state.messageCharCount} userFirstName={this.state.user.first_name} userLastName={this.state.user.last_name} userAvatar={this.state.user.avatar_url} onLogOut={this.handleLogout}/>) : '')}
    </>
    );
  }
}
