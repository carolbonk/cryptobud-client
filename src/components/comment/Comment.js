import React, { Component } from "react";
import { useState, useEffect } from "react";
import styles from "./Comment.module.scss";
import axios from "axios";
import {Link} from "react-router-dom";

export default class Comment extends Component {

    componentDidMount() {

      } 

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
      
       render() { 
            return (
     
              <div className={styles.comment}>

              
                   
              <div className={styles.comment__container}>
                 
                  <div className={styles.comment__user}> 
                   <img className={styles.comment__avatar} src={this.props.avatar}></img>
                   <Link className={styles.comment__userLink} to={"/user/" + this.props.userId}>
                   <label className={styles.comment__name}>{this.props.firstName + " " + this.props.lastName}</label>
                   </Link>
                   </div>
                   <p className={styles.comment__date}>{this.getDateString(this.props.date)}</p>
                   </div>
                   <div className={styles.comment__msg}>
                   <p>{this.props.message}</p>
                   </div>
                  
                   
             </div>
               );}    
}


