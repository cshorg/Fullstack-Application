import { Router } from 'express'
import {
  createPostsHandler,
  downvotePostHandler,
  removePostHandler,
  upvotePostHandler
} from '../controllers/post.controller'

const postRoutes = Router()

// prefix: /post
postRoutes.post('/create', createPostsHandler)
postRoutes.delete('/remove/:id', removePostHandler)

postRoutes.put('/upvote/:id', upvotePostHandler)
postRoutes.put('/downvote/:id', downvotePostHandler)

export default postRoutes
