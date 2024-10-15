import mongoose from 'mongoose'

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
  }
})

const PostModel = mongoose.model<PostDocument>('Post', postSchema)

export default PostModel
