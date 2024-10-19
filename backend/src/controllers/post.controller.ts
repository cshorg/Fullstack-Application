import {
  NOT_FOUND,
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT,
  TOO_MANY_REQUESTS
} from '../constants/http'
import PostModel, { PostDocument } from '../models/post.model'
import appAssert from '../utils/appAssert'
import catchErrors from '../utils/catchErrors'
import { postSchema } from './post.schemas'

// public route for home page posts
export const getPostsHandler = catchErrors(async (req, res) => {
  const skip = parseInt(req.query.skip as string) || 0
  // only returning data needed on frontend sorted in desc by createdAt.
  const posts = await PostModel.find(
    {},
    {
      userId: 1,
      title: 1,
      content: 1,
      votes: 1,
      createdAt: 1
    }
  )
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(10)
  appAssert(posts.length > 0, NOT_FOUND, 'There are currently no posts')

  // instead of returning array of userIds from votes, just return length to reduce bandwidth
  return res.status(OK).json(
    posts.map((post: PostDocument) => ({
      ...post.toObject(),
      votes: post.votes.length
    }))
  )
})

export const createPostsHandler = catchErrors(async (req, res) => {
  const request = postSchema.parse({
    ...req.body
  })

  // Find users latest post and limit the user by 1 minute before next post
  const lastPost = await PostModel.findOne({ userId: req.userId }).sort({
    createdAt: -1
  })
  appAssert(
    !(lastPost && Date.now() - new Date(lastPost.createdAt).getTime() < 30000),
    TOO_MANY_REQUESTS,
    'Too many requests, please try again in 30 seconds.'
  )

  const newPost = await PostModel.create({
    userId: req.userId,
    title: request.title,
    content: request.content
  })
  appAssert(newPost, BAD_REQUEST, 'Post could not be created')

  return res
    .status(OK)
    .json({ message: 'Post successfully created', post: newPost })
})

export const removePostHandler = catchErrors(async (req, res) => {
  const deletedPost = await PostModel.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId
  })
  appAssert(deletedPost, UNAUTHORIZED, 'Error trying to remove post')

  return res.status(OK).json({ message: 'Post successfully removed' })
})

export const upvotePostHandler = catchErrors(async (req, res) => {
  const post = await PostModel.findById(req.params.id)
  appAssert(
    !post?.votes.includes(req.userId.toString()),
    CONFLICT,
    'You have already upvoted this post'
  )

  const updatedPost = await PostModel.findByIdAndUpdate(
    req.params.id,
    { $push: { votes: req.userId } },
    { upsert: true, new: true }
  )
  appAssert(updatedPost, NOT_FOUND, 'Post was not found')

  return res.status(OK).json({ message: 'Post upvoted' })
})

export const downvotePostHandler = catchErrors(async (req, res) => {
  const post = await PostModel.findById(req.params.id)
  appAssert(
    post?.votes.includes(req.userId.toString()),
    CONFLICT,
    'You have not upvoted this post'
  )

  const updatedPost = await PostModel.findByIdAndUpdate(
    req.params.id,
    { $pull: { votes: req.userId } },
    { new: true }
  )
  appAssert(updatedPost, NOT_FOUND, 'Post was not found')

  return res.status(OK).json({ message: 'Post downvoted' })
})
