import React, { Component } from "react";
import styles from "./NewPost.module.scss";
import axios from "axios";
import Input from "../../components/input/Input";
import  parse  from "html-react-parser";
import  {MiniChart} from "react-ts-tradingview-widgets";
import {XYPlot, LineSeries, XAxis, YAxis} from 'react-vis';

export default class NewPost extends Component {

  componentDidMount(){


   }
      
      render() {
        let coinOptions = '';

       if (!!this.props.coins) 
       {
      coinOptions = this.props.coins.map(coin => {
        return <option key={coin.id} value={coin.id}>{coin.name}</option>
      });
    }
        
        return (
          <div className={styles.newPost}>
            <div className={styles.newPost__header}>
             <img className={styles.newPost__avatar} src={this.props.userAvatar}></img>  
            <p>Hey {this.props.userFirstName}, What's up?</p>
            </div>
            <form className={styles.newPost__form} onSubmit={this.props.onMessageSubmit}>
           <textarea name="message" onChange={this.props.onMessageChange} maxLength="300" placeholder="Start Typing..." className={styles.newPost__message}></textarea>
           <div className={styles.newPost__commentCount}>
             <span id="current">{this.props.messageCharCount}</span>
             <span id="maximum">/300</span>
           </div>
          <div className={styles.newPost__advancedOptions}>
          {(!!this.props.includeChart) ? 
          (<div>
            <h3>Chart Options</h3>
          <label>Coin</label>
          <select name="coin">{coinOptions}</select>
          <label>Time interval: daily average</label>
       
           <div>
   
           <Input label="Start Date" name="start_date" type="date"/>
           
           <Input label="End date" name="end_date" type="date"/>
           <button onClick={this.props.onPreview} name="preview">Preview</button>

            {!!this.props.chartData ?   
           <XYPlot xType='ordinal' height={300} width={500}>
           <XAxis  title="Time" tickLabelAngle={90} tickFormat={v => v}  style={{ticks: {stroke: '#000'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'6px'}}}/>
           <YAxis left={20}  title="Value (USD)" hideLine tickFormat={v => "$" + v} style={{ticks: {stroke: '#FFF'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'10px'}}}/>
           <LineSeries data={this.props.chartData} />
           </XYPlot> : ''
           }
           </div>
           </div>
          ): ''}
           </div>
           <div className={styles.newPost__funcContainer}>

           <Input type="file" name="image" label="Upload image" />
           <div className={styles.newPost__toggleBar}>

           
           <div className={styles.newPost__toggleContainer}>
        
           
           
           <button type="button" onClick={this.props.onIncludeChart} className={styles.newPost__postButton}>{!this.props.includeChart ? 'Include chart' : 'Exclude chart'}</button>
         
           <p className={styles.newPost__globalText}>GLOBAL</p>
           <a onClick={this.props.onGlobalToggleChange} href="#" className={styles.newPost__toggle + " " + (this.props.globalToggle ? styles.newPost__toggleGlobal : styles.newPost__toggleCluster)}></a>
           <p className={styles.newPost__clusterText}>CLUSTER ONLY</p>

           <button type="submit" className={styles.newPost__postButton}>Post</button>
          
          
           </div>

             
         
           </div>
        
           </div>

           </form>
          </div>
        );
      }
}