import React, {Component} from 'react';
import {Link} from "react-router-dom";
import styles from './Post.module.scss';
import axios from "axios";
import {XYPlot, LineSeries, XAxis, YAxis} from 'react-vis';

export default class Post extends Component {

  getDateString = (timestamp) => {
    let newDate = new Date(timestamp);
    return (
      (newDate.getHours()%12 === 0 ? 12 : newDate.getHours()%12) +
      ":"
      + 
      (newDate.getMinutes() < 10 ?  '0' + newDate.getMinutes() : newDate.getMinutes())
      +
      "  " + (newDate.getHours() >= 12 ? 'pm' : 'am') + " on "
      +
      (newDate.getMonth() +
      1) +
      "/" +
      newDate.getDate() 
    );
  };
 

  render () {

   let endDate = new Date(this.props.endDate);
   let startDate = new Date(this.props.startDate);

  let postDate = this.props.date;
    return (
     <div className={styles.post + " " + ((!!this.props.imageUrl || !!this.props.coin) ? styles.postWithImage : styles.postWithOutImage)}>

    <div className={styles.post__foreGroundContent}>
         
    <div className={styles.post__container}>
       
        <div className={styles.post__user}> 
         <img className={styles.post__avatar} src={this.props.avatar}></img>
         <Link className={styles.post__userLink} to={"/user/" + this.props.userId}>
         <label className={styles.post__name}>{this.props.firstName + " " + this.props.lastName}</label>
         </Link>
         </div>
         <p className={styles.post__date}>{this.getDateString(postDate)}</p>
         </div>
         <div className={styles.post__msg}>
         <p>{this.props.message}</p>
         </div>
         <div className={styles.post__imgContainer}>
         {!!this.props.imageUrl ? <img src={this.props.imageUrl} className={styles.post__image}/> : ''}
         {!!this.props.chartData ?   
        
        <div className={styles.post__chartContainer} >
          <div className={styles.post__chartLabel} >
           <p>{this.props.coin}</p>
           <p>{'From ' +  (startDate.getMonth() +
      1) + '/' + startDate.getDate() + '/' + startDate.getFullYear() + ' to ' +  (endDate.getMonth() +
      1) + '/' + endDate.getDate() + '/' + endDate.getFullYear() }</p>
         </div>
           <XYPlot xType='ordinal' height={300} width={500}>
           <XAxis  title="Time" tickLabelAngle={90} tickFormat={v => v}  style={{ticks: {stroke: '#000'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'6px'}}}/>
           <YAxis left={20}  title="Value (USD)" hideLine tickFormat={v => "$" + v} style={{ticks: {stroke: '#FFF'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'10px'}}}/>
           <LineSeries data={this.props.chartData} />
           </XYPlot> </div>: ''
           }
         </div>
         <p>3 comments</p>
        
         </div>
    <div className={styles.post__backgroundContent}>
        
    <div className={styles.post__container}>
       
        <div className={styles.post__user}> 
         <img className={styles.post__avatar} src={this.props.avatar}></img>
         <Link className={styles.post__userLink} to={"/user/" + this.props.userId}>
         <label className={styles.post__name}>{this.props.firstName + " " + this.props.lastName}</label>
         </Link>
         <div className={styles.post__global}>{this.props.global? 'Global': ' Cluster only'}</div>
         </div>
         <p className={styles.post__date}>{this.getDateString(postDate)}</p>
         </div>
         <div className={styles.post__msg}>
         <p>{this.props.message}</p>
         </div>
         <div className={styles.post__imgContainer}>
         {!!this.props.imageUrl ? <img src={this.props.imageUrl} className={styles.post__image}/> : ''}
         
         {!!this.props.chartData ?   
         <div className={styles.post__chartContainer} >
            <div className={styles.post__chartLabel} >
           <p>{this.props.coin}</p>
           <p>{'From ' +  (startDate.getMonth() +
      1) + '/' + startDate.getDate() + '/' + startDate.getFullYear() + ' to ' +  (endDate.getMonth() +
      1) + '/' + endDate.getDate() + '/' + endDate.getFullYear() }</p>
         </div>
           <XYPlot xType='ordinal' height={300} width={500}>
           <XAxis  title="Time" tickLabelAngle={90} tickFormat={v => v}  style={{ticks: {stroke: '#000'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'6px'}}}/>
           <YAxis left={20}  title="Value (USD)" hideLine tickFormat={v => "$" + v} style={{ticks: {stroke: '#FFF'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'10px'}}}/>
           <LineSeries data={this.props.chartData} />
           </XYPlot>  </div> : ''
          
           }
         </div>
         <p>3 comments</p>


        </div>
      </div>
    );}
  }