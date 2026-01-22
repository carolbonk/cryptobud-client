import React, { Component } from "react";
import axios from "axios";
import { Particle } from "jparticles";
import UnauthenticatedLanding from "../../components/unauthenticatedLanding/UnauthenticatedLanding";
import AuthenticatedHomepage from "../../components/authenticatedHomepage/AuthenticatedHomepage";
import { getAxiosConfig, setToken, removeToken, getToken, isAuthenticated } from "../../utils/authUtils";
import { formatChartData } from "../../utils/chartUtils";
import { encodeImageToBase64 } from "../../utils/imageUtils";

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

  handlePostMessageSubmit = async (event) => {
    event.preventDefault();

    if (this.state.preview) {
      this.getChartData(event);
    } else {
      let data = null;
      const fileName = event.target.image.value;

      if (!!fileName) {
        try {
          const { trimmedImage, imageType } = await encodeImageToBase64(event.target.image.files[0]);

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
        } catch (error) {
          console.error("Error encoding image:", error);
        }
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
    axios(getAxiosConfig('post', '/posts', data))
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
      .catch((error) => {
        console.error("Error posting message:", error);
      });
  };

  handleLogout = () => {
    removeToken();
    this.setState({
      user: null,
      posts: [],
      lastTopIndex: 0,
    });
  };

  handleLogInSubmit = (event) => {
    event.preventDefault();

    const loginData = {
      email: event.target.email.value,
      password: event.target.password.value,
    };

    axios(getAxiosConfig('post', '/users/login', loginData))
      .then((response) => {
        setToken(response.data.token);
        return axios(getAxiosConfig('get', '/users/current'));
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
      .catch((error) => {
        this.setState({
          failedAuth: true,
          error: error.response?.data
        });
      });
  };

  componentDidMount() {
    if (isAuthenticated()) {
      axios(getAxiosConfig('get', '/users/current'))
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

  getChartData = (event) => {
    if (!isAuthenticated()) {
      this.setState({ failedAuth: true });
      return;
    }

    const endpoint = `/charts/${event.target.coin.value}/history?interval=d1&start=${new Date(event.target.start_date.value).getTime()}&end=${new Date(event.target.end_date.value).getTime()}`;

    axios(getAxiosConfig('get', endpoint))
      .then((response) => {
        const chartData = formatChartData(response.data);
        this.setState({ chartData: chartData, preview: false });
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
      });
  };

  handlePreviewClick = () => {
    this.setState({
      preview: true,
    });
  };

  getCoins = () => {
    if (!isAuthenticated()) {
      this.setState({ failedAuth: true });
      return;
    }

    axios(getAxiosConfig('get', '/charts/coins'))
      .then((response) => {
        this.setState({ coinOptions: response.data });
      })
      .catch((error) => {
        console.error("Error fetching coins:", error);
      });
  };

  refreshPosts = () => {
    if (!!this.state.user) {
      if (!isAuthenticated()) {
        this.setState({ failedAuth: true });
        return;
      }

      axios(getAxiosConfig('get', '/posts?from=0&to=10'))
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
              postsToAdd.forEach((post) => {
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

  getPosts = () => {
    if (!!this.state.user) {
      if (!isAuthenticated()) {
        this.setState({ failedAuth: true });
        return;
      }

      const from = this.state.lastTopIndex;
      const to = from + 10;

      axios(getAxiosConfig('get', `/posts?from=${from}&to=10`))
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
