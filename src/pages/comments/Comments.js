import React, { Component } from "react";
import styles from "./Comments.module.scss";
import axios from "axios";
import Post from "../../components/post/Post.js";
import Comment from "../../components/comment/Comment.js";
import Header from "../../components/header/Header.js";
import { getAxiosConfig, removeToken, isAuthenticated } from "../../utils/authUtils";
import { formatChartData } from "../../utils/chartUtils";

export default class Comments extends Component {
  state = {
    user: null,
    comments: [],
    post: null,
  };

  componentDidMount() {
    axios(getAxiosConfig('get', '/users/current'))
      .then((response) => {
        this.setState(
          {
            user: response.data,
          },
          () => {
            this.getComments();
          }
        );
      })
      .catch((error) => {
        console.error("Error fetching current user:", error);
      });
    setInterval(this.getComments, 5000);
  }

  handleLogout = () => {
    removeToken();
    this.setState({
      user: null,
      posts: [],
      lastTopIndex: 0,
    });
  };
  handleDump = (id, requiresDelete) => {
    if (requiresDelete) {
      axios(getAxiosConfig('delete', `/posts/${id}/likes`))
        .then(() => {
          this.addLike(id, "dump");
        })
        .catch((error) => {
          console.error(`Error deleting like for post ${id}:`, error);
        });
    } else {
      this.addLike(id, "dump");
    }
  };

  handleHodl = (id, requiresDelete) => {
    if (requiresDelete) {
      axios(getAxiosConfig('delete', `/posts/${id}/likes`))
        .then(() => {
          this.addLike(id, "hodl");
        })
        .catch((error) => {
          console.error(`Error deleting like for post ${id}:`, error);
        });
    } else {
      this.addLike(id, "hodl");
    }
  };

  addLike = (id, type) => {
    const data = { type };
    axios(getAxiosConfig('post', `/posts/${id}/likes`, data))
      .then(() => {
        this.getLikesDataForPost(id);
      })
      .catch((error) => {
        console.error(`Error adding ${type} to post ${id}:`, error);
      });
  };

  deleteLike = (id) => {
    axios(getAxiosConfig('delete', `/posts/${id}/likes`))
      .then(() => {
        this.getLikesDataForPost(id);
      })
      .catch((error) => {
        console.error(`Error deleting like from post ${id}:`, error);
      });
  };

  handleUnDump = (id) => {
    this.deleteLike(id);
  };

  handleUnHodl = (id) => {
    this.deleteLike(id);
  };

  getLikesDataForPost = (id) => {
    const post = this.state.post;

    axios(getAxiosConfig('get', `/posts/${id}/likes`))
      .then((response) => {
        post.hodlCounter = response.data.hodlCounter;
        post.dumpCounter = response.data.dumpCounter;
        post.userHasInteracted = response.data.userHasInteracted;
        post.userLikeType = response.data.userLikeType;

        this.setState({ post: post }, () => {
          if (!!post.coin) {
            this.getChartDataForPost(post.id);
          }
        });
      })
      .catch((error) => {
        console.error(`Error fetching likes for post ${id}:`, error);
      });
  };
  getChartDataForPost = () => {
    const post = this.state.post;
    const endpoint = `/charts/${post.coin}/history?interval=d1&start=${new Date(post.start_date).getTime()}&end=${new Date(post.end_date).getTime()}`;

    axios(getAxiosConfig('get', endpoint))
      .then((response) => {
        const chartData = formatChartData(response.data);
        post.chartData = chartData;
        this.setState({ post: post });
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
      });
  };

  handlePostComment = (event) => {
    event.preventDefault();

    const newComment = {
      message: event.target.message.value,
    };

    axios(getAxiosConfig('post', `/posts/${this.props.match.params.post_id}/comments`, newComment))
      .then(() => {
        this.getComments();
        event.target.message.value = "";
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
      });
  };

  getComments = () => {
    if (!!this.state.user) {
      if (!isAuthenticated()) {
        this.setState({ failedAuth: true });
        return;
      }

      axios(getAxiosConfig('get', `/posts/${this.props.match.params.post_id}/comments`))
        .then((response) => {
          const firstComment = response.data.posts[0];
          if (!this.state.post) {
            const post = {
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
            };

            this.setState(
              {
                comments: response.data.posts,
                post: post,
              },
              () => {
                this.getLikesDataForPost(post.id);
              }
            );
          } else {
            this.setState({
              comments: response.data.posts,
            });
          }
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    }
  };

  render() {
    let comments = this.state.comments;

    let commentDisplays = comments.map((comment) => {
      if (!!comment.id) {
        return (
          <Comment
            key={comment.id}
            id={comment.id}
            message={comment.message}
            date={comment.date}
            firstName={comment.first_name}
            lastName={comment.last_name}
            userId={comment.user_id}
            avatar={comment.avatar_url}
          />
        );
      } else return "";
    });

    return (
      <>
        <Header onLogOut={this.handleLogout} />
        {!!this.state.post ? (
          <div className={styles.comments}>
            <Post
              key={this.state.post.id}
              Id={this.state.post.id}
              avatar={this.state.post.avatar_url}
              firstName={this.state.post.first_name}
              lastName={this.state.post.last_name}
              imageUrl={this.state.post.image_url}
              message={this.state.post.message}
              date={this.state.post.date}
              userId={this.state.post.user_id}
              global={this.state.post.global}
              coin={this.state.post.coin}
              startDate={this.state.post.start_date}
              endDate={this.state.post.end_date}
              chartData={this.state.post.chartData}
              hideComments={true}
              hodlCounter={this.state.post.hodlCounter}
              dumpCounter={this.state.post.dumpCounter}
              userHasInteracted={this.state.post.userHasInteracted}
              userLikeType={this.state.post.userLikeType}
              onDump={this.handleDump}
              onHodl={this.handleHodl}
              onUnHodl={this.handleUnHodl}
              onUnDump={this.handleUnDump}
            />
            <h3>Comments</h3>
            {commentDisplays}
            <div>
              <form
                className={styles.comments__newMessageContainer}
                onSubmit={this.handlePostComment}
              >
                <h3>What do you think?</h3>
                <textarea
                  name="message"
                  maxLength="255"
                  placeholder="Start Typing..."
                  className={styles.comments__message}
                ></textarea>
                <button className={styles.comments__postButton}>
                  Add comment
                </button>
              </form>
            </div>
          </div>
        ) : (
          ""
        )}
      </>
    );
  }
}
