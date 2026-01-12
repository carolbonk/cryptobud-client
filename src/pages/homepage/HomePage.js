import React, { Component } from "react";
import axios from "axios";
import { Particle } from "jparticles";
import UnauthenticatedLanding from "../../components/unauthenticatedLanding/UnauthenticatedLanding";
import AuthenticatedHomepage from "../../components/authenticatedHomepage/AuthenticatedHomepage";

export default class HomePage extends Component {
  state = {
    user: null,
    messageCharCount: 0,
    globalToggle: true,
    posts: [],
    lastTopIndex: 0,
    numberOfPosts: 0,
    morePosts: true,
    includeChart: false,
    coinOptions: null,
    chartData: null,
    preview: false,
  };

  handleIncludeChartClick = (event) => {
    let currentIncludeChart = this.state.includeChart;
    this.setState({
      includeChart: !currentIncludeChart,
    });

    if (!currentIncludeChart) {
    }
  };

  handlePostMessageChange = (event) => {
    this.setState({
      messageCharCount: event.target.value.length,
    });
  };

  handlePostMessageSubmit = (event) => {
    event.preventDefault();
    let name = event.target.getAttribute("name");

    if (this.state.preview) {
      this.getChartData(event);
    } else {
      let data = null;
      let fileName = event.target.image.value;
      if (!!fileName) {
        let imageType = fileName.split(".")[1];
        const fileReader = new FileReader();

        fileReader.addEventListener("load", () => {
          let image = fileReader.result;

          let trimmedImage = image.split(",")[1];

          data = {
            message: event.target.message.value,
            global: this.state.globalToggle,
            image: trimmedImage,
            image_type: imageType,
            coin: this.state.includeChart ? event.target.coin.value : "",
            start_date: this.state.includeChart
              ? new Date(event.target.start_date.value).getTime()
              : "",
            end_date: this.state.includeChart
              ? new Date(event.target.end_date.value).getTime()
              : "",
          };

          this.postMessage(data, event);
        });

        fileReader.readAsDataURL(event.target.image.files[0]);
      } else {
        data = {
          message: event.target.message.value,
          global: this.state.globalToggle,
          coin: this.state.includeChart ? event.target.coin.value : "",
          start_date: this.state.includeChart
            ? new Date(event.target.start_date.value).getTime()
            : "",
          end_date: this.state.includeChart
            ? new Date(event.target.end_date.value).getTime()
            : "",
        };

        this.postMessage(data, event);
      }
    }
  };

  postMessage = (data, event) => {
    var config = {
      method: "post",
      url: process.env.REACT_APP_REMOTE_SERVER + "/posts",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
      data: data,
    };

    axios(config)
      .then((response) => {
        event.target.message.value = "";
        event.target.image.value = "";
        if (!!event.target.start_date) {
          event.target.start_date.value = "";
          event.target.end_date.value = "";
        }

        this.setState(
          {
            messageCharCount: 0,
            includeChart: false,
          },
          this.refreshPosts
        );
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  handleLogout = () => {
    sessionStorage.removeItem("token");
    this.setState({
      user: null,
      posts: [],
      lastTopIndex: 0,
    });
  };

  handleLogInSubmit = (event) => {
    event.preventDefault();

    axios
      .post(process.env.REACT_APP_REMOTE_SERVER + "/users/login", {
        email: event.target.email.value,
        password: event.target.password.value,
      })
      .then((response) => {
        sessionStorage.setItem("token", response.data.token);
        axios
          .get(process.env.REACT_APP_REMOTE_SERVER + "/users/current", {
            headers: {
              Authorization: "Bearer " + response.data.token,
            },
          })
          .then((response) => {
            this.setState(
              {
                user: response.data,
              },
              () => {
                this.getPosts();
              }
            );
          })
          .catch(() => {
            this.setState({
              failedAuth: true,
            });
          });
      })
      .catch((error) => {
        this.setState({ error: error.response.data });
      });
  };

  componentDidMount() {
    if (!!sessionStorage.getItem("token")) {
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
            }
          );

          this.getCoins();
        })
        .catch(() => {
          this.setState({
            failedAuth: true,
          });
        });
    }
    new Particle("#background", {
      color: "#25bfff",
      lineShape: "cube",
      range: 2000,
      proximity: 100,
      parallax: true,
    });

    setInterval(this.refreshPosts, 5000);
  }

  getChartDataForPost = (id) => {
    let posts = this.state.posts;
    let post = posts.find((post) => {
      return post.id === id;
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
      return post.id === id;
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

  getChartData = (event) => {
    if (!sessionStorage.getItem("token")) {
      this.setState({ failedAuth: true });
      return;
    }

    var config = {
      method: "get",
      url:
        process.env.REACT_APP_REMOTE_SERVER + "/charts/" +
        event.target.coin.value +
        "/history?" +
        "interval=" +
        "d1" +
        "&start=" +
        new Date(event.target.start_date.value).getTime() +
        "&end=" +
        new Date(event.target.end_date.value).getTime(),
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

        this.setState({ chartData: chartData, preview: false });
      })
      .catch(() => {
        console.log("error");
      });
  };

  handlePreviewClick = () => {
    this.setState({
      preview: true,
    });
  };

  getCoins = () => {
    if (!sessionStorage.getItem("token")) {
      this.setState({ failedAuth: true });
      return;
    }

    var config = {
      method: "get",
      url: process.env.REACT_APP_REMOTE_SERVER + "/charts/coins",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    };
    axios(config)
      .then((response) => {
        this.setState({ coinOptions: response.data });
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
        url: process.env.REACT_APP_REMOTE_SERVER + "/posts?from=0&to=10",
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
            postsToAdd.forEach((post) => {
              this.getLikesDataForPost(post.id);
            });
          }
        );
      });
    }
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
        url: process.env.REACT_APP_REMOTE_SERVER + "/posts?from=" + from + "&to=" + 10,
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

  handleRefresh = () => {
    this.getPosts();
  };

  handleToggleChange = (event) => {
    event.preventDefault();

    let currentToggle = this.state.globalToggle;
    this.setState({
      globalToggle: !currentToggle,
    });
  };
//this.state.posts.length != 0 
  render() {
    return (
      <>
        {!this.state.user ? (
          <UnauthenticatedLanding onLogIn={this.handleLogInSubmit} />
        ) : (
          <AuthenticatedHomepage
            onDump={this.handleDump}
            onHodl={this.handleHodl}
            onUnHodl={this.handleUnHodl}
            onUnDump={this.handleUnDump}
            onGetChartData={this.getChartDataForPost}
            chartData={this.state.chartData}
            onPreview={this.handlePreviewClick}
            onRefresh={this.handleRefresh}
            includeChart={this.state.includeChart}
            onIncludeChart={this.handleIncludeChartClick}
            numberOfPosts={this.state.posts.length}
            getPosts={this.getPosts}
            onMessageSubmit={this.handlePostMessageSubmit}
            morePosts={this.state.morePosts}
            posts={this.state.posts}
            onGlobalToggleChange={this.handleToggleChange}
            globalToggle={this.state.globalToggle}
            onMessageChange={this.handlePostMessageChange}
            messageCharCount={this.state.messageCharCount}
            userFirstName={this.state.user.first_name}
            userLastName={this.state.user.last_name}
            userAvatar={this.state.user.avatar_url}
            coins={this.state.coinOptions}
            onLogOut={this.handleLogout}
          />
        ) 
        }
      </>
    );
  }
}
