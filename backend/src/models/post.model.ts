import mongoose from 'mongoose'
import { thirtyDaysFromNow } from '../utils/date'

export interface PostDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId
  title: String
  content: String
  votes: [String]
  createdAt: Date
  expiresAt: Date
}

const postSchema = new mongoose.Schema<PostDocument>({
  userId: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  votes: {
    type: [String]
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: true,
    default: thirtyDaysFromNow
  }
})

const PostModel = mongoose.model<PostDocument>('Post', postSchema)

export default PostModel
