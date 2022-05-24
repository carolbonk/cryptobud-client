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
     <div className={styles.post + " " + ((!!this.props.imageUrl || !!this.props.coin) ? (this.props.imageUrl? styles.postWithImage : styles.postWithChart) : styles.postWithOutImage)}>

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
         <div className={styles.post__largeChart}>
           <XYPlot xType='ordinal' height={500} width={700}>
           <XAxis  title="Time" tickLabelAngle={90} tickFormat={v => v}  style={{ticks: {stroke: '#000'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'6px'}}}/>
           <YAxis left={20}  title="Value (USD)" hideLine tickFormat={v => "$" + v} style={{ticks: {stroke: '#FFF'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'10px'}}}/>
           <LineSeries data={this.props.chartData} />
           </XYPlot>  </div>
           
           <div className={styles.post__smallChart}>
           <XYPlot xType='ordinal' height={200} width={300}>
           <XAxis  title="Time" tickLabelAngle={90} tickFormat={v => v}  style={{ticks: {stroke: '#000'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'6px'}}}/>
           <YAxis left={20}  title="Value (USD)" hideLine tickFormat={v => "$" + v} style={{ticks: {stroke: '#FFF'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'10px'}}}/>
           <LineSeries data={this.props.chartData} />
           </XYPlot>  </div>
           
           </div>: ''
           }
         </div>

         <div className={styles.post__likeOptions}>
           {! this.props.userHasInteracted ? 
           <div>
           <button onClick={() => {this.props.onDump(this.props.Id, false)}}>Dump</button>
           <button onClick={() => {this.props.onHodl(this.props.Id, false)}}>Hodl</button> </div>: 
           (this.props.userLikeType == 'hodl' ? 
           <div>
           <button onClick={() => {this.props.onDump(this.props.Id, true)}}> Dump</button>
           <button onClick={() => {this.props.onUnHodl(this.props.Id)}}>Unhodl</button> </div>
           :
           <div>
           <button onClick={() => {this.props.onUnDump(this.props.Id)}}>Undump</button>
           <button onClick={() => {this.props.onHodl(this.props.Id, true)}}>Hodl</button> </div>
           )
            }

           <div>{this.props.dumpCounter + ' DUMPs ' + this.props.hodlCounter + ' HODLs '}</div>

           </div>
          {!!this.props.hideComments? '' :  
          <Link className={styles.post__userLink} to={"/post/" + this.props.Id + "/comments"}> 
         <p className={styles.post__viewComments}>View comments</p>
        </Link>} 
        
         </div>
    <div className={styles.post__backgroundContent}>
        
    <div className={styles.post__container}>
       
        <div className={styles.post__user}> 
         <img className={styles.post__avatar} src={this.props.avatar}></img>
         <Link className={styles.post__userLink} to={"/user/" + this.props.userId}>
         <label className={styles.post__name}>{this.props.firstName + " " + this.props.lastName}</label>
         </Link>
         <div className={styles.post__global}>{this.props.global? '• GLOBAL': ' • CLUSTER ONLY'}</div>
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
         <div className={styles.post__largeChart}>
           <XYPlot xType='ordinal' height={500} width={700}>
           <XAxis  title="Time" tickLabelAngle={90} tickFormat={v => v}  style={{ticks: {stroke: '#000'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'6px'}}}/>
           <YAxis left={20}  title="Value (USD)" hideLine tickFormat={v => "$" + v} style={{ticks: {stroke: '#FFF'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'10px'}}}/>
           <LineSeries data={this.props.chartData} />
           </XYPlot>  </div>
           
           <div className={styles.post__smallChart}>
           <XYPlot xType='ordinal' height={200} width={300}>
           <XAxis  title="Time" tickLabelAngle={90} tickFormat={v => v}  style={{ticks: {stroke: '#000'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'6px'}}}/>
           <YAxis left={20}  title="Value (USD)" hideLine tickFormat={v => "$" + v} style={{ticks: {stroke: '#FFF'},
          text:  { stroke: 'none', fill: '#6b6b76', fontWeight: 800, fontSize:'10px'}}}/>
           <LineSeries data={this.props.chartData} />
           </XYPlot>  </div>
           
           </div> : ''
          
           }
         </div>

       <div className={styles.post__likeOptions}>
         {! this.props.userHasInteracted ? 
           <div>
           <button>Dump</button>
           <button>Hodl</button> </div>: 
           (this.props.userLikeType == 'hodl' ? 
           <div>
           <button>Dump</button>
           <button>Unhodl</button> </div>
           :
           <div>
           <button>Undump</button>
           <button>Hodl</button> </div>
           )
            }
          <div>{this.props.dumpCounter + ' DUMPs ' + this.props.hodlCounter + ' HODLs '}</div>
          </div>

         {!!this.props.hideComments? '' :  
          <Link className={styles.post__userLink} to={"/post/" + this.props.Id + "/comments"}> 
         <p className={styles.post__viewComments}>View comments</p>
         </Link>
          } 
         

        </div>
      </div>
    );}
  }