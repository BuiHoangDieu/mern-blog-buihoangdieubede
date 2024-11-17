import Comment from "../models/comment.model.js";

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { userId, content, postId } = req.body;
    // console.log(req.body);

    if (userId !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      // Create comment
      const newComment = new Comment({
        userId,
        content,
        postId,
      });
      await newComment.save();
      res.status(200).json(newComment);
    }
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes = comment.likes.filter((id) => id !== req.user.id);
      // comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    } else {
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "You are not alowed to edit this comment" });
      } else {
        const editorComment = await Comment.findByIdAndUpdate(
          req.params.commentId,
          { content: req.body.content },
          { new: true }
        );
        res.status(200).json(editorComment);
      }
    }
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    } else {
      if (comment.userId !== req.user.id && !req.user.isAdmin) {
        return res
          .status(403)
          .json({ message: "You are not alowed to delete this comment" });
      } else {
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const getAllComments = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Unauthorized" });
  } else {
    try {
      const startIndex = parseInt(req.query.startIndex) || 0;
      const limit = parseInt(req.query.limit) || 9;
      const sortDirection = req.query.sort === "desc" ? -1 : 1;
      const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);
      const totalComment = await Comment.countDocuments();
      const now = new Date();
      const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      );
      const lastMonthAgo = await Comment.find({
        createdAt: { $gte: oneMonthAgo },
      });

      res.status(200).json({
        comments,
        totalComment,
        lastMonthAgo: lastMonthAgo.length,
      });
    } catch (error) {
      next(error);
    }
  }
};
