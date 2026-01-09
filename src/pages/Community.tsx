import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ThumbsUp, Share2, Plus, Send, X } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { mockCommunityPosts } from "../data/mockData"
import { useTranslation } from "react-i18next"

export function Community() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState(mockCommunityPosts)
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState("")
  const [commentingOn, setCommentingOn] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")

  const handleLike = (postId: string) => {
    const newLiked = new Set(likedPosts)
    const isLiked = likedPosts.has(postId)
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1
        }
      }
      return post
    }))
    
    if (isLiked) {
      newLiked.delete(postId)
    } else {
      newLiked.add(postId)
    }
    setLikedPosts(newLiked)
  }

  const handleComment = (postId: string) => {
    if (!commentText.trim()) return
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        }
      }
      return post
    }))
    
    setCommentText("")
    setCommentingOn(null)
    alert("Comment added successfully!")
  }

  const handleShare = (post: any) => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.author}`,
        text: post.content,
      }).catch(() => {})
    } else {
      navigator.clipboard.writeText(post.content)
      alert("Post content copied to clipboard!")
    }
  }

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return
    
    const newPost = {
      id: String(posts.length + 1),
      author: "You",
      avatar: "Y",
      content: newPostContent,
      likes: 0,
      comments: 0,
      time: "Just now",
      tags: ["General"]
    }
    
    setPosts([newPost, ...posts])
    setNewPostContent("")
    setShowCreatePost(false)
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold">{t('community.title')}</h1>
          <p className="text-muted-foreground">Connect, share, and learn from other farmers</p>
        </div>
        <Button onClick={() => setShowCreatePost(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('community.createPost')}
        </Button>
      </motion.div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg p-6 w-full max-w-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{t('community.createPost')}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowCreatePost(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={t('community.whatOnMind')}
                className="w-full min-h-[150px] p-3 border rounded-md resize-none"
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                  {t('community.post')}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                    {post.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{post.author}</h3>
                        <p className="text-sm text-muted-foreground">{post.time}</p>
                      </div>
                      <div className="flex gap-2">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-base">{post.content}</p>
                    <div className="mt-4 flex items-center gap-6 border-t pt-4">
                      <Button 
                        variant={likedPosts.has(post.id) ? "default" : "ghost"} 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleLike(post.id)}
                      >
                        <ThumbsUp className={`h-4 w-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                        {post.likes} {t('community.like')}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => setCommentingOn(post.id)}
                      >
                        <MessageSquare className="h-4 w-4" />
                        {post.comments} {t('community.comments')}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleShare(post)}
                      >
                        <Share2 className="h-4 w-4" />
                        {t('community.share')}
                      </Button>
                    </div>
                    
                    {/* Comment Input */}
                    <AnimatePresence>
                      {commentingOn === post.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="mt-3 border-t pt-3"
                        >
                          <div className="flex gap-2">
                            <Input
                              placeholder={t('community.writeComment')}
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleComment(post.id)}
                            />
                            <Button 
                              size="icon"
                              onClick={() => handleComment(post.id)}
                              disabled={!commentText.trim()}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
