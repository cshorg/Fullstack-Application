import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePost } from '../lib/api'
import { AUTH } from './useAuth'

const useDeletePost = (postId) => {
  const queryClient = useQueryClient()

  const { mutate, ...rest } = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      queryClient.setQueryData([AUTH], (cache) =>
        cache.posts.filter((post) => post._id !== postId)
      )
    }
  })

  return {
    deletePost: mutate,
    ...rest
  }
}

export default useDeletePost
