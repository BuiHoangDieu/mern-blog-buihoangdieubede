import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";

function removeVietnameseTones(str) {
  return str
    .normalize("NFD") // Tách các dấu ra khỏi ký tự
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu
    .replace(/đ/g, "d") // Thay thế "đ" thành "d"
    .replace(/Đ/g, "D") // Thay thế "Đ" thành "D"
    .replace(/[^a-zA-Z0-9 ]/g, ""); // Loại bỏ các ký tự đặc biệt nếu cần
}

export const createPost = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please fill all the input"));
  }
  const slug = removeVietnameseTones(req.body.title)
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savePost = await newPost.save();
    res.status(201).json(savePost);
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = req.query.limit || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const query = {
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    };
    const posts = await Post.find(query)
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit)
      .exec();

    const totalPosts = await Post.countDocuments({});
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    // console.log(posts);

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    return next(errorHandler(500, error.message));
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  } else {
    try {
      await Post.findByIdAndDelete(req.params.postId);
      res.status(200).json("Post has been deleted");
    } catch (error) {
      return next(errorHandler(500, error.message));
    }
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  } else {
    try {
      const updatePost = await Post.findByIdAndUpdate(
        req.params.postId,
        {
          $set: {
            title: req.body.title,
            content: req.body.content,
            image: req.body.image,
            category: req.body.category,
          },
        },
        { new: true }
      );

      res.status(200).json(updatePost);
    } catch (error) {
      return next(errorHandler(500, error.message));
    }
  }
};
