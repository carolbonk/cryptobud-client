import React, { Component } from "react";
import { useState, useEffect } from "react";
import styles from "./Comment.module.scss";
import axios from "axios";


export default class Comment extends Component {

    componentDidMount() {

      } 
/*
      const Comments = ({ currentUserId}) => {
        const [backendComments, setBackendComments] = useState([]);
        const rootComments = backendComments.filter(
          (backendComment) => backendComment.parentId === null
        );
      
        console.log("backendComments", backendComments);
      
        useEffect(() => {
          getCommentsApi().then((data) => {
            setBackendComments(data);
          }); 
        }, []); */
      
       render() { 
            return (
              /* <div className = "comments">
                <div className = "comments-container">
              {rootComments.map(rootComment => (
                <comment key={rootComment.id} comment={rootComment}/> 
              ))}
                </div>
              </div>
            );
              
            */
                <div className={styles.comment}>
                    <img></img>
                    <div><p>Comment {this.props.date}</p></div>
                    <label>{this.props.firstName + " " + this.props.lastName}</label>
                    <p>{this.props.message}</p>
                 </div>
               );}    
}


/* import CommentForm from "./CommentForm";
const Comment = ({
  comment,
  replies, 
  setActiveComment,
  activeComment,
  updateComment,
  deleteComment,
  addComment,
  parentId = null,
  currentUserId,
}) => {
  const isEditing =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "editing";
  const isReplying =
    activeComment &&
    activeComment.id === comment.id &&
    activeComment.type === "replying";
  const fiveMinutes = 300000;
  const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes;
  const canDelete =
    currentUserId === comment.userId && replies.length === 0 && !timePassed;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.userId && !timePassed;
  const replyId = parentId ? parentId : comment.id;
  const createdAt = new Date(comment.createdAt).toLocaleDateString();
  return (
    <div key={comment.id} className="flex mb-7">
      <div className="mr-3">
        <img src="/images/user-icon.png" className="rounded-full" />
    <div key={comment.id} className="comment">
      <div className="comment-image-container">
        <img src="/user-icon.png" />
      </div>
      <div className="w-full">
        <div className="flex flex-col md:flex-row">
          <div className="mr-2 text-xl text-blue-500">{comment.username}</div>
      <div className="comment-right-part">
        <div className="comment-content">
          <div className="comment-author">{comment.username}</div>
          <div>{createdAt}</div>
        </div>
        {!isEditing && <div className="text-lg">{comment.body}</div>}
        {!isEditing && <div className="comment-text">{comment.body}</div>}
        {isEditing && (
          <CommentForm
            submitLabel="Update"
            hasCancelButton
                        initialText={comment.body}
            handleSubmit={(text) => updateComment(text, comment.id)}
            handleCancel={() => {
              setActiveComment(null);
            }}
          />
        )}
        <div className="flex text-xs text-color-gray-500 cursor-pointer mt-2">
        <div className="comment-actions">
          {canReply && (
            <div
              className="mr-2 hover:underline"
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "replying" })
              }
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="mr-2 hover:underline"
              className="comment-action"
              onClick={() =>
                setActiveComment({ id: comment.id, type: "editing" })
              }
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div
              className="mr-2 hover:underline"
              className="comment-action"
              onClick={() => deleteComment(comment.id)}
            >
              Delete
            </div>
          )}
        </div>
        {isReplying && (
          <CommentForm
            submitLabel="Reply"
            handleSubmit={(text) => addComment(text, replyId)}
          />
        )}
        {replies.length > 0 && (
          <div className="mt-5">
          <div className="replies">
            {replies.map((reply) => (
              <Comment
                comment={reply}
                key={reply.id}
                setActiveComment={setActiveComment}
                activeComment={activeComment}
                updateComment={updateComment}
                deleteComment={deleteComment}
                addComment={addComment}
                parentId={comment.id}
                replies={[]}
                currentUserId={currentUserId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Comment; */