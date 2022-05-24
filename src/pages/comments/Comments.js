import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import styles from "./Comments.module.scss";
import axios from "axios";
import Footer from "../../components/footer/Footer.js";
import Login from "../../components/login/Login.js";
import { Particle } from 'jparticles'
import Post from "../../components/post/Post.js";
import Comment from "../../components/comment/Comment.js";
import Header from "../../components/header/Header.js";

export default class Comments extends Component {
    state = {
        user: null,
        comments: [],
        post: null
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
            }, () => {this.getComments();
      
            })});
        setInterval(
            this.getComments, 5000);
    }

    handleLogout = () => {
        sessionStorage.removeItem("token");
        this.setState({
            user: null,
            posts:[],
            lastTopIndex:0
        });
      };
      handleDump = (id, requiresDelete) => {
  
        if (requiresDelete)
        {
          var config = {
            method: 'delete',
            url: ('http://localhost:8080/posts/' + id + '/likes'),
            headers: { 
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          };
       axios(config)
          .then((response) => {
            this.addLike(id, "dump");
          }) .catch(() => {
            console.log("error");
        });
        }
        else
        {
          this.addLike(id, "dump");
        }
      }
    
      handleHodl = (id, requiresDelete) => {
    
    
        if (requiresDelete)
        {
          var config = {
            method: 'delete',
            url: ('http://localhost:8080/posts/' + id + '/likes'),
            headers: { 
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          };
       axios(config)
          .then((response) => {
            this.addLike(id, "hodl");
          }) .catch(() => {
            console.log("error");
        });
        }
        else
        {
          this.addLike(id, "hodl");
        }
        
      }
    
      addLike = (id, type) => {
        let data = 
        {
          type: type
        }
         var config = {
           method: 'post',
           url: ('http://localhost:8080/posts/' + id + '/likes'),
           headers: { 
             'Authorization': 'Bearer ' + sessionStorage.getItem('token')
           },
           data : data
         };
      axios(config)
         .then((response) => {
    
           this.getLikesDataForPost(id);
         }) .catch(() => {
           console.log("error");
       });
      }
    
      deleteLike = (id) => {
         var config = {
           method: 'delete',
           url: ('http://localhost:8080/posts/' + id + '/likes'),
           headers: { 
             'Authorization': 'Bearer ' + sessionStorage.getItem('token')
           }
         };
      axios(config)
         .then((response) => {
           this.getLikesDataForPost(id);
         }) .catch(() => {
           console.log("error");
       });
      }
    
      handleUnDump = (id) => {
       this.deleteLike(id);
      }
      handleUnHodl = (id) => {
        this.deleteLike(id);
      }
      getLikesDataForPost = (id) => {
        
        let post = this.state.post;
    
        var config = {
          method: 'get',
          url: ('http://localhost:8080/posts/' + id + '/likes'),
          headers: { 
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        };
     axios(config)
        .then((response) => {
       
        
         post.hodlCounter = response.data.hodlCounter;
         post.dumpCounter = response.data.dumpCounter;
         post.userHasInteracted = response.data.userHasInteracted;
         post.userLikeType = response.data.userLikeType;
    
         this.setState({post:post}, () =>{
          if (!!post.coin)
          {
            this.getChartDataForPost(post.id);
          }});
    
        }) .catch(() => {
          console.log("error");
      });
      
      }
      getChartDataForPost = (id) => {
    
        let post = this.state.post;
        
    
        var config = {
          method: 'get',
          url: ('http://localhost:8080/charts/' + post.coin + '/history?' + 'interval=' + 'd1' + '&start=' + (new Date(post.start_date)).getTime() + '&end=' + (new Date(post.end_date)).getTime()),
          headers: { 
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        };
     axios(config)
        .then((response) => {
       
          console.log(response);
          let chartData = response.data.map(dataPoint =>{
            let date = new Date(dataPoint.date)
            let chartPoint = {
              x: (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear(),
              y: dataPoint.priceUsd
            }
            return chartPoint;
          });  
    
         post.chartData = chartData;
         this.setState({post:post});
    
        }) .catch(() => {
          console.log("error");
      });
      
      }

      handlePostComment = (event) => {

        event.preventDefault();

          let newComment = {
                        message: event.target.message.value
          };

          var config = {
            method: 'post',
            url: 'http://localhost:8080/posts/' + this.props.match.params.post_id +  '/comments',
            headers: { 
                'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            },
            data : newComment
          };
          
          axios(config)
          .then((response) => {
            this.getComments();
            event.target.message.value = '';
          })
          .catch(function (error) {
            console.log(error);
          });

      }

      getComments = () => {

        if (!!this.state.user)
        {
        if (!sessionStorage.getItem('token')) {
          this.setState({ failedAuth: true });
          return;
        }

        var config = {
          method: 'get',
          url: ('http://localhost:8080/posts/' + this.props.match.params.post_id + '/comments'),
          headers: { 
            'Authorization': 'Bearer ' + sessionStorage.getItem('token')
          }
        };
        
        axios(config)
        .then((response) => {

        let firstComment = response.data.posts[0];
        if (!this.state.post)
        {
          let post = {
            id: firstComment.postId,
            message: firstComment.postMessage,
            first_name: firstComment.postFirstName,
            last_name: firstComment.postLastName,
            image_url: firstComment.postImageURL,
            avatar_url: firstComment.postAvatarUrl,
            global: firstComment.postGlobal,
            date: firstComment.postDate,
            coin: firstComment.postCoin,
            start_date: firstComment.postStartDate,
            end_date: firstComment.postEndDate,
            user_id: firstComment.postUserId,
          }
            
            this.setState({
              comments: response.data.posts,
              post: post
              },
            () => {
              
                
                  this.getLikesDataForPost(post.id);
                
        })
    }
        else
        {
            this.setState({
                comments: response.data.posts});
        }
    })
        .catch(function (error) {
          console.log(error);
        });
      }
    }

    render() {

        let comments = this.state.comments;

        let commentDisplays = comments.map(comment => {
            if (!!comment.id)
            {
            return (<Comment key={comment.id} id={comment.id} message={comment.message} date={comment.date} firstName={comment.first_name} lastName={comment.last_name} userId={comment.user_id} avatar={comment.avatar_url}/>);
            }
            else
            return '';
        });

        return (
    <>
    <Header onLogOut={this.handleLogout}/>
    {!!this.state.post ?
    (
        <div className={styles.comments}>
    <Post  key={this.state.post.id} Id={this.state.post.id} avatar={this.state.post.avatar_url} firstName={this.state.post.first_name} lastName={this.state.post.last_name} imageUrl={this.state.post.image_url}  message={this.state.post.message} date={this.state.post.date} userId={this.state.post.user_id} global={this.state.post.global} coin={this.state.post.coin} startDate={this.state.post.start_date} endDate={this.state.post.end_date} chartData={this.state.post.chartData} hideComments={true} hodlCounter={this.state.post.hodlCounter} dumpCounter={this.state.post.dumpCounter} userHasInteracted={this.state.post.userHasInteracted} userLikeType={this.state.post.userLikeType} onDump={this.handleDump} onHodl={this.handleHodl} onUnHodl={this.handleUnHodl} onUnDump={this.handleUnDump}/>
    <h3>Comments</h3>
    {commentDisplays}
    <div>
    <form className={styles.comments__newMessageContainer} onSubmit={this.handlePostComment}>
    <h3>What do you think?</h3>
    <textarea name="message" maxLength="255" placeholder="Start Typing..." className={styles.comments__message}></textarea>
    <button className={styles.comments__postButton}>Add comment</button>
    </form>
    </div>
    
    </div>) : ''
    }
     </>
        )};
}