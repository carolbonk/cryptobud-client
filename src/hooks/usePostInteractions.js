import { useState, useCallback } from 'react';
import axios from 'axios';
import { getAxiosConfig } from '../utils/authUtils';

const usePostInteractions = () => {
  const [likesData, setLikesData] = useState({});

  const getLikesDataForPost = useCallback(async (postId) => {
    try {
      const response = await axios(getAxiosConfig('get', `/posts/${postId}/likes`));

      let hodlCount = 0;
      let dumpCount = 0;
      let postIsLikedByUser = false;
      let userLikeType = null;

      response.data.forEach((like) => {
        if (like.type === 'hodl') {
          hodlCount++;
        } else if (like.type === 'dump') {
          dumpCount++;
        }
      });

      postIsLikedByUser = response.data.some((like) => like.currentUser === true);
      const userLike = response.data.find((like) => like.currentUser === true);
      if (userLike) {
        userLikeType = userLike.type;
      }

      setLikesData(prev => ({
        ...prev,
        [postId]: { hodlCount, dumpCount, postIsLikedByUser, userLikeType }
      }));

      return { hodlCount, dumpCount, postIsLikedByUser, userLikeType };
    } catch (error) {
      console.error(`Error fetching likes for post ${postId}:`, error);
      throw error;
    }
  }, []);

  const addLike = useCallback(async (postId, type) => {
    const data = { type };
    try {
      await axios(getAxiosConfig('post', `/posts/${postId}/likes`, data, { 'Content-Type': 'application/json' }));
      await getLikesDataForPost(postId);
    } catch (error) {
      console.error(`Error adding ${type} to post ${postId}:`, error);
      throw error;
    }
  }, [getLikesDataForPost]);

  const deleteLike = useCallback(async (postId) => {
    try {
      await axios(getAxiosConfig('delete', `/posts/${postId}/likes`));
      await getLikesDataForPost(postId);
    } catch (error) {
      console.error(`Error deleting like from post ${postId}:`, error);
      throw error;
    }
  }, [getLikesDataForPost]);

  const handleDump = useCallback(async (postId, requiresDelete) => {
    try {
      if (requiresDelete) {
        await deleteLike(postId);
      }
      await addLike(postId, 'dump');
    } catch (error) {
      console.error(`Error handling dump for post ${postId}:`, error);
    }
  }, [addLike, deleteLike]);

  const handleHodl = useCallback(async (postId, requiresDelete) => {
    try {
      if (requiresDelete) {
        await deleteLike(postId);
      }
      await addLike(postId, 'hodl');
    } catch (error) {
      console.error(`Error handling hodl for post ${postId}:`, error);
    }
  }, [addLike, deleteLike]);

  const handleUnDump = useCallback(async (postId) => {
    await deleteLike(postId);
  }, [deleteLike]);

  const handleUnHodl = useCallback(async (postId) => {
    await deleteLike(postId);
  }, [deleteLike]);

  return {
    likesData,
    getLikesDataForPost,
    handleDump,
    handleHodl,
    handleUnDump,
    handleUnHodl
  };
};

export default usePostInteractions;
