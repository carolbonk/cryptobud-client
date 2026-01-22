import React, { Component } from "react";
import styles from "./UserProfile.module.scss";
import axios from "axios";
import Post from "../../components/post/Post.js";
import Header from "../../components/header/Header.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { getAxiosConfig, removeToken, isAuthenticated } from "../../utils/authUtils";
import { formatChartData } from "../../utils/chartUtils";


export default class UserProfile extends Component {
  state = {
    user: null,
    messageCharCount: 0,
    posts: [],
    lastTopIndex: 0,
    numberOfPosts: 0,
    morePosts: true,
    currentProfile: null,
    chartData: null,
  };

  handleLogout = () => {
    removeToken();
    this.setState({
      user: null,
      posts: [],
      lastTopIndex: 0,
    });
  };

  componentDidMount() {
    axios(getAxiosConfig('get', '/users/current'))
      .then((response) => {
        this.setState(
          {
            user: response.data,
          },
          () => {
            this.getPosts();
            this.getProfile();
          }
        );
      })
      .catch(() => {
        this.setState({
          failedAuth: true,
        });
      });

    setInterval(this.refreshPosts, 5000);
  }

  getProfile = () => {
    axios(getAxiosConfig('get', `/users/id/${this.props.match.params.user_id}`))
      .then((response) => {
        this.setState({
          currentProfile: response.data,
        });
      })
      .catch(() => {
        this.setState({
          failedAuth: true,
        });
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
    const posts = this.state.posts;
    const post = posts.find((post) => post.id === id);

    axios(getAxiosConfig('get', `/posts/${id}/likes`))
      .then((response) => {
        post.hodlCounter = response.data.hodlCounter;
        post.dumpCounter = response.data.dumpCounter;
        post.userHasInteracted = response.data.userHasInteracted;
        post.userLikeType = response.data.userLikeType;

        this.setState({ posts: posts }, () => {
          if (!!post.coin) {
            this.getChartDataForPost(post.id);
          }
        });
      })
      .catch((error) => {
        console.error(`Error fetching likes for post ${id}:`, error);
      });
  };

  refreshPosts = () => {
    if (!!this.state.user) {
      if (!isAuthenticated()) {
        this.setState({ failedAuth: true });
        return;
      }

      const endpoint = `/posts?from=0&to=10&user_id=${this.props.match.params.user_id}`;

      axios(getAxiosConfig('get', endpoint))
        .then((response) => {
          const currentPosts = this.state.posts;
          const incomingPosts = response.data.posts;

          const postsToAdd = incomingPosts.filter((incomingPost) => {
            return !currentPosts.find((currentPost) => currentPost.id === incomingPost.id);
          });

          const posts = postsToAdd.concat(currentPosts);

          this.setState(
            {
              lastTopIndex: this.state.lastTopIndex + postsToAdd.length,
              posts: posts,
            },
            () => {
              response.data.posts.forEach((post) => {
                this.getLikesDataForPost(post.id);
              });
            }
          );
        })
        .catch((error) => {
          console.error("Error refreshing posts:", error);
        });
    }
  };

  handleFollow = () => {
    axios(getAxiosConfig('post', `/users/${this.props.match.params.user_id}/follow`))
      .then(() => {
        this.getProfile();
        this.setState(
          {
            posts: [],
            lastTopIndex: 0,
          },
          this.getPosts
        );
      })
      .catch((error) => {
        console.error("Error following user:", error);
      });
  };

  handleUnfollow = () => {
    axios(getAxiosConfig('delete', `/users/${this.props.match.params.user_id}/follow`))
      .then(() => {
        this.getProfile();
        this.setState(
          {
            posts: [],
            lastTopIndex: 0,
          },
          this.getPosts
        );
      })
      .catch((error) => {
        console.error("Error unfollowing user:", error);
      });
  };

  getPosts = () => {
    if (!!this.state.user) {
      if (!isAuthenticated()) {
        this.setState({ failedAuth: true });
        return;
      }

      const from = this.state.lastTopIndex;
      const to = from + 10;
      const endpoint = `/posts?from=${from}&to=10&user_id=${this.props.match.params.user_id}`;

      axios(getAxiosConfig('get', endpoint))
        .then((response) => {
          const currentPosts = this.state.posts;
          const newPosts = currentPosts.concat(response.data.posts);

          const morePosts = newPosts.length >= currentPosts.length + 10;
          const nextLastTopIndex = to + 1;

          this.setState(
            {
              lastTopIndex: nextLastTopIndex,
              posts: newPosts,
              morePosts: morePosts,
            },
            () => {
              response.data.posts.forEach((post) => {
                this.getLikesDataForPost(post.id);
              });
            }
          );
        })
        .catch((error) => {
          console.error("Error fetching posts:", error);
        });
    }
  };

  getChartDataForPost = (id) => {
    const posts = this.state.posts;
    const post = posts.find((post) => post.id === id);

    const endpoint = `/charts/${post.coin}/history?interval=d1&start=${new Date(post.start_date).getTime()}&end=${new Date(post.end_date).getTime()}`;

    axios(getAxiosConfig('get', endpoint))
      .then((response) => {
        const chartData = formatChartData(response.data);
        post.chartData = chartData;
        this.setState({ posts: posts });
      })
      .catch((error) => {
        console.error(`Error fetching chart data for post ${id}:`, error);
      });
  };

  handleToggleChange = () => {
    let currentToggle = this.state.globalToggle;
    this.setState({
      globalToggle: !currentToggle,
    });
  };

  render() {
    let posts = null;

    if (!!this.state.posts) {
      posts = this.state.posts.map((post) => {
        return (
          <div key={post.id} className={styles.homePage__postWrapper}>
            <Post
              key={post.id}
              Id={post.id}
              avatar={post.avatar_url}
              firstName={post.first_name}
              lastName={post.last_name}
              imageUrl={post.image_url}
              message={post.message}
              date={post.date}
              userId={post.user_id}
              global={post.global}
              coin={post.coin}
              startDate={post.start_date}
              endDate={post.end_date}
              chartData={post.chartData}
              hodlCounter={post.hodlCounter}
              dumpCounter={post.dumpCounter}
              userHasInteracted={post.userHasInteracted}
              userLikeType={post.userLikeType}
              onDump={this.handleDump}
              onHodl={this.handleHodl}
              onUnHodl={this.handleUnHodl}
              onUnDump={this.handleUnDump}
            />
          </div>
        );
      });
    }

    if (!!this.state.currentProfile) {
      return (
        <>
          <Header onLogOut={this.handleLogout} />
          <main className={styles.homePage}>
            <div className={styles.homePage__feed}>
              <div className={styles.homePage__currentProfile}>
                <img
                  className={styles.homePage__avatar}
                  src={this.state.currentProfile.avatar_url}
                  alt={`${this.state.currentProfile.first_name} ${this.state.currentProfile.last_name}'s avatar`}
                ></img>
                <h1>
                  {this.state.currentProfile.first_name +
                    " " +
                    this.state.currentProfile.last_name}
                </h1>

                <p>
                  {this.state.currentProfile.city +
                    ", " +
                    this.state.currentProfile.country}
                </p>
                <div>
                  {this.state.currentProfile.id !== this.state.user.id ? (
                    this.state.currentProfile.isFriend ? (
                      <button className={styles.homePage__followButton} onClick={this.handleUnfollow}>Unfollow</button>
                    ) : (
                      <button className={styles.homePage__followButton} onClick={this.handleFollow}>Follow</button>
                    )
                  ) : (
                    <h3>Your profile</h3>
                  )}
                </div>
              </div>

              <InfiniteScroll
                dataLength={this.state.posts.length}
                next={() => {
                  this.getPosts();
                }}
                hasMore={this.state.morePosts}
                loader={<h4>Loading...</h4>}
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>wow, you have seen it all!</b>
                  </p>
                }
              >
                {posts}
              </InfiniteScroll>
            </div>
          </main>
        </>
      );
    } else {
      return;
    }
  }
}
