const Post = require("../../models/Post");
const { UserInputError, AuthenticationError } = require("apollo-server");

const checkAuth = require("../../util/check-auth");

module.exports = {
  Mutation: {
    //   we need the context tomake sure that our user is logged in
    createComment: async (_, { postId, body }, context) => {
      const { username, image } = checkAuth(context); //to make sure that you are logged in

      if (body.trim() === "") {
        throw new UserInputError("Empty Comment", {
          errors: {
            body: "Comment body must not be empty",
          },
        });
      }
      const post = await Post.findById(postId);

      if (post) {
        //   unshift to make the comment added to the Top
        post.comments.unshift({
          body,
          username,
          createdAt: new Date().toISOString(),
          image,
        });
        await post.save();
        return post;
      } else {
        throw new UserInputError("Post not found");
      }
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (post) {
        const commentIndex = post.comments.findIndex((c) => c.id === commentId);
        //   make sure that we are the owner of the comment
        if (post.comments[commentIndex].username === username) {
          post.comments.splice(commentIndex, 1);
          await post.save();
          return post;
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } else {
        throw new UserInputError("Post Not Found");
      }
    },
  },
};
