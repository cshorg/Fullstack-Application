import {
  NOT_FOUND,
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  CONFLICT
} from '../constants/http'
import PostModel from '../models/post.model'
import appAssert from '../utils/appAssert'
import catchErrors from '../utils/catchErrors'
import { postSchema } from './post.schemas'

// public route for home page posts
export const getPostsHandler = catchErrors(async (req, res) => {
  // only grab data needed
  const posts = await PostModel.find().sort({ createdAt: -1 })
  appAssert(posts, NOT_FOUND, 'There are currently no posts')

  return res.status(OK).json(posts)
})

export const createPostsHandler = catchErrors(async (req, res) => {
  const request = postSchema.parse({
    ...req.body
  })

  const newPost = await PostModel.create({
    userId: req.userId,
    title: request.title,
    content: request.content
  })
  appAssert(newPost, BAD_REQUEST, 'Post could not be created')

  return res.status(OK).json({ message: 'Post successfully created' })
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
