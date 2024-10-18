import { useQuery } from '@tanstack/react-query'
import { getPosts } from '../lib/api'

export const POSTS = 'posts'

const usePosts = (opts = {}) => {
  const { data: posts = [], ...rest } = useQuery({
    queryKey: [POSTS],
    queryFn: getPosts,
    ...opts
  })

  return {
    posts,
    ...rest
  }
}

export default usePosts
