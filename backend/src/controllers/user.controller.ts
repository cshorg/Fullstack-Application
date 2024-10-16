import { NOT_FOUND, OK } from '../constants/http'
import PostModel from '../models/post.model'
import UserModel from '../models/user.model'
import appAssert from '../utils/appAssert'
import catchErrors from '../utils/catchErrors'
import { PostDocument } from '../models/post.model'

export const getUserHandler = catchErrors(async (req, res) => {
  const user = await UserModel.findById(req.userId)
  appAssert(user, NOT_FOUND, 'User not found')

  const userPosts = await PostModel.find(
    {
      userId: req.userId
    },
    {
      title: 1,
      content: 1,
      votes: 1,
      createdAt: 1
    },
    {
      sort: { createdAt: -1 }
    }
  )

  return res.status(OK).json({
    user: user.omitPassword(),
    posts: userPosts.map((post: PostDocument) => ({
      ...post.toObject(),
      votes: post.votes.length
    }))
  })
})
