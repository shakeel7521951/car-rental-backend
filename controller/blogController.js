import Blog from "../models/Blogs.js";

export const addBlog = async (req, res) => {
  try {
    const { title, description, postedDate } = req.body;
    const image = req.file?.path;

    if (!title || !description || !postedDate || !image) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBlog = new Blog({
      title,
      description,
      postedDate,
      image,
    });

    await newBlog.save();

    res.status(201).json({
      message: "Blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();

    if (blogs.length === 0) {
      return res.status(404).json({ message: "No blogs found!" });
    }

    res.status(200).json({ blogs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found!" });
    }

    res
      .status(200)
      .json({ message: "Blog deleted successfully", deletedBlog: blog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blogData = { ...req.body };

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    if (Object.keys(blogData).length === 0) {
      return res.status(400).json({ message: "No update data provided" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(blogId, blogData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.status(200).json({ message: "Blog updated successfully", updatedBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const postComment = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { commentText } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Please log in first" });
    }
    if (!commentText) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $push: { comments: { userId, text: commentText, date: new Date() } } },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res
      .status(200)
      .json({ message: "Comment added successfully", updatedBlog });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in first" });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const hasLiked = blog.likes.includes(userId);

    if (hasLiked) {
      blog.likes = blog.likes.filter((id) => id.toString() !== userId);
      await blog.save();
      return res.status(200).json({ message: "Like removed", blog });
    } else {
      blog.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: "Blog liked", blog });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { blogId, commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized. Please log in first." });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const comment = blog.comments.find((c) => c._id.toString() === commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const hasLiked = comment.likes.includes(userId);

    if (hasLiked) {
      comment.likes = comment.likes.filter((id) => id.toString() !== userId);
      await blog.save();
      return res
        .status(200)
        .json({ message: "Like removed from comment", blog });
    } else {
      comment.likes.push(userId);
      await blog.save();
      return res.status(200).json({ message: "Comment liked", blog });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};