const express = require("express")
const forum = express.Router()
const DB = require('../db/dbConn.js')
const multer = require("multer");
const upload = multer();
const authenticate = require('./authMiddleware.js');


forum.get("/posts/:pet", async (req, res) => {
  try {
    const { pet } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortBy = req.query.sortBy;
    const offset = (page - 1) * limit;
    console.log(`Fetching posts for pet: ${pet}, page: ${page}, limit: ${limit}, sortBy: ${sortBy}`);

    const posts = await DB.getPostsFinal(pet, '', limit, offset, sortBy);
    const totalCount = await DB.countPostsByPetAndCategory(pet, '');
    const totalPages = Math.ceil(totalCount / limit);
    
    res.json({ posts, page, limit, totalPages, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


forum.get("/posts/:pet/:category", async (req, res) => {
  try {
    const { pet, category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sortBy = req.query.sortBy || "";
    const offset = (page - 1) * limit;
    console.log(`Fetching posts for pet: ${pet}, category: ${category || ''}, page: ${page}, limit: ${limit}, sortBy: ${sortBy}`);

    const posts = await DB.getPostsFinal(pet, category || '', limit, offset, sortBy);
    const totalCount = await DB.countPostsByPetAndCategory(pet, category || '');
    const totalPages = Math.ceil(totalCount / limit);
    // if (sortBy === "newest" || sortBy === "oldest"){
    //posts.reverse(); // Reverse the order to show latest posts first
    res.json({ posts, page, limit, totalPages, totalCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});


forum.get("/comments", async (req, res) => {
  try {
    const postIdsParam = req.query.postIds;
    if (!postIdsParam) {
      return res.status(400).json({ error: "Missing postIds parameter" });
    }
    const postIds = postIdsParam.split(',').map(id => id.trim());
    const comments = await DB.getCommentsByPostIds(postIds);
    if (comments && comments.length > 0) {
      res.json(comments);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

forum.post("/posts/:postId", authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    const userId = req.user.id;; // Replace with req.user?.id if using authentication 

    if (!content) {
      return res.status(400).json({ error: "Missing comment text" });
    }

    const result = await DB.addCommentToPost(postId, userId, content);
    

    res.status(201).json({ message: "Comment added", commentId: result.insertId });
  } catch (err) {
    console.error("Failed to add comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

forum.post("/", authenticate, upload.single("photo"), (req, res) => {
  try {
    // Extract fields from form
    const { pet, category, description, vetOnly } = req.body;
    console.log("Received post data:", req.user.id);
    const userId = req.user.id; // assuming you have authentication middleware

    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    // do this in the frontend
    if (!pet || !category || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // photo buffer or null if no file uploaded
    const photoBuffer = req.file ? req.file.buffer : null;

    // Convert vetOnly from string to boolean (because form sends strings)
    // vetOnly can be "true" or "false" from form input, convert to boolean
    const type = vetOnly === "true" ? 1 : 0;
    console.log(photoBuffer);
    DB.createPost({ description, photoBuffer, type, userId, pet, category })
  } catch (err) {
    console.error("Post creation failed:", err);
    res.status(500).json({ error: "Failed to create post" });
  }
});

forum.delete('/posts/:postId', authenticate, async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await DB.deletePost(postId);
    console.log('Delete result:', postId, deleted);

    if (!deleted) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    res.json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Delete post error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

forum.delete('/comments/:commentId', authenticate, async (req, res) => {
  try {
    const { commentId } = req.params;
    const deleted = await DB.deleteComment(commentId);
    console.log('Delete result:', commentId, deleted);

    if (!deleted) {
      return res.status(404).json({ message: 'Comment not found.' });
    }
    res.json({ message: 'Comment deleted successfully.' });
  } catch (err) {
    console.error('Delete comment error:', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// forum.get('/posts/:pet/:category', async (req, res, next) => {
//     try {
//         const pet = req.params.pet;
//         const category = req.params.category;
//         const posts = await DB.getPostsByPetAndCategory(pet, category);
//         if (posts && posts.length > 0) {
//             res.json(posts);
//         } else {
//             res.sendStatus(404);
//         }
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// });

// forum.get('/posts/:pet', async (req, res, next) => {
//     try {
//         const pet = req.params.pet;
//         const posts = await DB.getPostsByPet(pet);
//         if (posts && posts.length > 0) {
//             res.json(posts);
//         } else {
//             res.sendStatus(404);
//         }
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// });


// forum.get('/posts', async (req, res, next) => {
//     try {
//         const queryResult = await DB.allPosts();
//         console.log(queryResult);
//         res.json(queryResult);
//     } catch (err) {
//         console.log(err);
//         res.sendStatus(500);
//     }
// });

forum.use((req, res) => {
  console.error("Unmatched forum route:", req.method, req.originalUrl);
  res.status(404).json({ error: "Not found" });
});

module.exports = forum;
