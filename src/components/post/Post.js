import React, {Component} from 'react';
import {Link} from "react-router-dom";
import styles from './Post.module.scss';
import axios from "axios";


export default class Post extends Component {

 

  render () {
 
    return (
     <div className={styles.post}>
    <a href="#" className={styles.post__foreGroundContent}>
        
         <p>Post {this.props.date}</p>
         <label>{this.props.firstName + " " + this.props.lastName}</label>
         <p>{this.props.message}</p>
         
         <p>3 comments</p>
         <div></div> 
         </a>
    <a href="#" className={styles.post__backgroundContent}>
        
        <p>Post {this.props.date}</p>
        <label>{this.props.firstName + " " + this.props.lastName}</label>
        <p>{this.props.message}</p>
        
        <p>3 comments</p>
        <div></div> 
        </a>
      </div>
    );}
  }