import React, { Component } from "react";
import { Link} from "react-router-dom";
import styles from "./AuthenticatedHomepage.module.scss";
import axios from "axios";
import NewPost from "../newPost/NewPost.js";
import Post from "../post/Post.js";
import Comment from "../comment/Comment.js";
import Header from "../header/Header.js";
import InfiniteScroll from "react-infinite-scroll-component";
import { Ticker } from "react-ts-tradingview-widgets";
import  parse  from "html-react-parser";
//import { Ticker} from "react-tradingview-embed";

export default class AuthenticatedHomepage extends Component {
scriptAdded = false;
  
   componentDidMount(){

    if (!this.scriptAdded)
    {
      setTimeout(() => {
        const script = document.createElement("script");

        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
        script.async = true;
    
        document.body.appendChild(script);
        this.scriptAdded = true;
      }, 1000);
    
   
    }
  

   }

      render() {
        let posts = null;
    

   

// HTML received from the server
const tickerHTML = `
<!-- TradingView Widget BEGIN -->
<div class="tradingview-widget-container">
  <div class="tradingview-widget-container__widget"></div>
  <div class="tradingview-widget-copyright"><a href="https://www.tradingview.com/markets/" rel="noopener" target="_blank"><span class="blue-text">Markets</span></a> by TradingView</div>
  <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js" async>
  {
  "symbols": [
    {
      "proName": "BITSTAMP:BTCUSD",
      "title": "Bitcoin"
    },
    {
      "proName": "BITSTAMP:ETHUSD",
      "title": "Ethereum"
    },
    {
      "description": "Tether",
      "proName": "COINBASE:USDTUSD"
    },
    {
      "description": "BNB",
      "proName": "BINANCE:BNBUSD"
    },
    {
      "description": "Cardano",
      "proName": "COINBASE:ADAUSD"
    },
    {
      "description": "Dogecoin",
      "proName": "COINBASE:DOGEUSD"
    }
  ],
  "showSymbolLogo": true,
  "colorTheme": "dark",
  "isTransparent": true,
  "displayMode": "adaptive",
  "locale": "en"
}
  </script>
</div>
<!-- TradingView Widget END -->
`;

        if (!!this.props.posts)
        {
        posts = this.props.posts.map(post => {

          
         return(
          <div key={post.id}  className={styles.homePage__postWrapper}>
          <Post key={post.id} avatar={post.avatar_url} firstName={post.first_name} lastName={post.last_name} imageUrl={post.image_url}  message={post.message} date={post.date} userId={post.user_id} global={post.global} coin={post.coin} startDate={post.start_date} endDate={post.end_date} chartData={post.chartData}/>
          </div>
         )
       }) }
        return (

          <>
        
          <Header onLogOut={this.props.onLogOut}/>
          {parse(tickerHTML)}
        <div className={styles.homepage__tickerWrapper}>
          {
     
        } 
        </div>

          <main className={styles.homePage}>
            <div className={styles.homePage__feed}> 
           <NewPost onPreview={this.props.onPreview} chartData={this.props.chartData} coins={this.props.coins} onIncludeChart={this.props.onIncludeChart} includeChart={this.props.includeChart} onMessageSubmit={this.props.onMessageSubmit} onGlobalToggleChange={this.props.onGlobalToggleChange} globalToggle={this.props.globalToggle} userFirstName={this.props.userFirstName} userLastName={this.props.userLastName} userAvatar={this.props.userAvatar} onMessageChange={this.props.onMessageChange} messageCharCount={this.props.messageCharCount}/>   
         
           <InfiniteScroll
          dataLength={this.props.numberOfPosts}
          next={() => {console.log("number of posts in data length: " + this.props.numberOfPosts);
          this.props.getPosts();}}
          hasMore={this.props.morePosts}
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
          
          </> );

      }
}