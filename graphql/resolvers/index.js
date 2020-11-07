const postsResolvers = require("./posts");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
  //Here Post, every time a Query or a MUTATION OR A Subsription that returns a post,
  // it will go throup this Post Modifier and apply  thes modificztions

  Post: {
    // parents holds the data that comes from the previous step
    likeCount: (parent) => {
      // console.log(parent);
      return parent.likes.length;
    },
    commentCount: (parent) => {
      return parent.comments.length;
    },
  },
  Query: {
    ...postsResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postsResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
  Subscription: {
    ...postsResolvers.Subscription,
  },
};
