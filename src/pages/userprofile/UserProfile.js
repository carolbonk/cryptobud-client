import React, { Component } from "react";
import styles from "./UserProfile.module.scss";
import axios from "axios";
import Post from "../../components/post/Post.js";
import Header from "../../components/header/Header.js";
import InfiniteScroll from "react-infinite-scroll-component";


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
    sessionStorage.removeItem("token");
    this.setState({
      user: null,
      posts: [],
      lastTopIndex: 0,
    });
  };

  componentDidMount() {
    axios
      .get(process.env.REACT_APP_REMOTE_SERVER + "/users/current", {
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      })
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

    //this.getPosts();

    setInterval(this.refreshPosts, 5000);
  }

  getProfile = () => {
    axios
      .get(
        process.env.REACT_APP_REMOTE_SERVER + "/users/id/" + this.props.match.params.user_id,
        {
          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
        }
      )
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
      var config = {
        method: "delete",
        url: process.env.REACT_APP_REMOTE_SERVER + "/posts/" + id + "/likes",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      };
      axios(config)
        .then((response) => {
          this.addLike(id, "dump");
        })
        .catch(() => {
          console.log("error");
        });
    } else {
      this.addLike(id, "dump");
    }
  };

  handleHodl = (id, requiresDelete) => {
    if (requiresDelete) {
      var config = {
        method: "delete",
        url: process.env.REACT_APP_REMOTE_SERVER + "/posts/" + id + "/likes",
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      };
      axios(config)
        .then((response) => {
          this.addLike(id, "hodl");
        })
        .catch(() => {
          console.log("error");
        });
    } else {
      this.addLike(id, "hodl");
    }
  };

  addLike = (id, type) => {
    let data = {
      type: type,
    };
    var config = {
      method: "post",
      url: process.env.REACT_APP_REMOTE_SERVER + "/posts/" + id + "/likes",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      data: data,
    };
    axios(config)
      .then((response) => {
        this.getLikesDataForPost(id);
      })
      .catch(() => {
        console.log("error");
      });
  };

  deleteLike = (id) => {
    var config = {
      method: "delete",
      url: process.env.REACT_APP_REMOTE_SERVER + "/posts/" + id + "/likes",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    axios(config)
      .then((response) => {
        this.getLikesDataForPost(id);
      })
      .catch(() => {
        console.log("error");
      });
  };

  handleUnDump = (id) => {
    this.deleteLike(id);
  };
  handleUnHodl = (id) => {
    this.deleteLike(id);
  };
  getLikesDataForPost = (id) => {
    let posts = this.state.posts;
    let post = posts.find((post) => {
      return post.id == id;
    });

    var config = {
      method: "get",
      url: process.env.REACT_APP_REMOTE_SERVER + "/posts/" + id + "/likes",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    axios(config)
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
      .catch(() => {
        console.log("error");
      });
  };

  refreshPosts = () => {
    if (!!this.state.user) {
      if (!sessionStorage.getItem("token")) {
        this.setState({ failedAuth: true });
        return;
      }

      var config = {
        method: "get",
        url:
          process.env.REACT_APP_REMOTE_SERVER + "/posts?from=0&to=10" +
          "&user_id=" +
          this.props.match.params.user_id,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      };
      axios(config).then((response) => {
        let currentPosts = this.state.posts;

        let incomingPosts = response.data.posts;

        let postsToAdd = incomingPosts.filter((incomingPost) => {
          return !currentPosts.find((currentPost) => {
            return currentPost.id === incomingPost.id;
          });
        });

        let posts = postsToAdd.concat(currentPosts);

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
      });
    }
  };

  handleFollow = () => {
    var config = {
      method: "post",
      url:
        process.env.REACT_APP_REMOTE_SERVER + "/users/" +
        this.props.match.params.user_id +
        "/follow",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };

    axios(config).then((response) => {
      this.getProfile();
      this.setState(
        {
          posts: [],
          lastTopIndex: 0,
        },
        this.getPosts
      );
    });
  };

  handleUnfollow = () => {
    var config = {
      method: "delete",
      url:
        process.env.REACT_APP_REMOTE_SERVER + "/users/" +
        this.props.match.params.user_id +
        "/follow",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };

    axios(config).then((response) => {
      this.getProfile();
      this.setState(
        {
          posts: [],
          lastTopIndex: 0,
        },
        this.getPosts
      );
    });
  };

  getPosts = () => {
    if (!!this.state.user) {
      if (!sessionStorage.getItem("token")) {
        this.setState({ failedAuth: true });
        return;
      }

      let from = this.state.lastTopIndex;
      let to = from + 10;

      var config = {
        method: "get",
        url:
          process.env.REACT_APP_REMOTE_SERVER + "/posts?from=" +
          from +
          "&to=" +
          10 +
          "&user_id=" +
          this.props.match.params.user_id,
        headers: {
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      };

      axios(config)
        .then((response) => {
          let currentPosts = this.state.posts;

          let newPosts = currentPosts.concat(response.data.posts);

          let morePosts = true;
          if (newPosts.length < currentPosts.length + 10) {
            morePosts = false;
          }
          let nextLastTopIndex = to + 1;

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
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  getChartDataForPost = (id) => {
    let posts = this.state.posts;
    let post = posts.find((post) => {
      return post.id == id;
    });

    var config = {
      method: "get",
      url:
        process.env.REACT_APP_REMOTE_SERVER + "/charts/" +
        post.coin +
        "/history?" +
        "interval=" +
        "d1" +
        "&start=" +
        new Date(post.start_date).getTime() +
        "&end=" +
        new Date(post.end_date).getTime(),
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    axios(config)
      .then((response) => {
        let chartData = response.data.map((dataPoint) => {
          let date = new Date(dataPoint.date);
          let chartPoint = {
            x:
              date.getMonth() +
              1 +
              "/" +
              date.getDate() +
              "/" +
              date.getFullYear(),
            y: dataPoint.priceUsd,
          };
          return chartPoint;
        });

        post.chartData = chartData;
        this.setState({ posts: posts });
      })
      .catch(() => {
        console.log("error");
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
                  {this.state.currentProfile.id != this.state.user.id ? (
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
