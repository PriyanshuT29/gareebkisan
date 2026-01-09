import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, ThumbsUp, Share2, Plus, Send, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { useTranslation } from "react-i18next"
import { supabase } from "../lib/supabase"

// Database Interfaces
interface Post {
  id: string
  content: string
  image_url: string | null
  created_at: string
  farmer_id: string
  farmers: {
    name: string
  }
  // We fetch counts/likes via nested select
  post_likes: { farmer_id: string }[]
  post_comments: { id: string }[]
}

interface Comment {
  id: string
  post_id: string
  farmer_id: string
  comment: string
  created_at: string
  farmers: {
    name: string
  }
}

export function Community() {
  const { t } = useTranslation()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreatePost, setShowCreatePost] = useState(false)

  // Post Creation State
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostImage, setNewPostImage] = useState<File | null>(null)
  const [isPosting, setIsPosting] = useState(false)

  // Commenting State
  const [commentingOn, setCommentingOn] = useState<string | null>(null)
  const [commentText, setCommentText] = useState("")
  const [activeComments, setActiveComments] = useState<Comment[]>([])
  const [loadingComments, setLoadingComments] = useState(false)

  const currentFarmerId = localStorage.getItem("farmer_id")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initial Fetch & Realtime Subscription
  useEffect(() => {
    fetchPosts()

    // Subscribe to changes on all 3 tables
    const channel = supabase
      .channel("community-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "community_posts" },
        () => fetchPosts()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_likes" },
        () => fetchPosts() // Refetch to update like counts/state
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "post_comments" },
        (payload) => {
          fetchPosts() // Refetch post list for comment counts
          // If viewing comments for this post, refetch them too
          if (commentingOn && payload.new && (payload.new as any).post_id === commentingOn) {
            fetchComments(commentingOn)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [commentingOn])

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...")
      const { data, error } = await supabase
        .from("community_posts")
        .select(`
          *,
          farmers (name),
          post_likes (farmer_id),
          post_comments (id)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Supabase fetch error:", JSON.stringify(error, null, 2))
        alert(`Fetch Error: ${JSON.stringify(error)}`)
        throw error
      }

      console.log("Fetched posts:", data)
      setPosts(data as unknown as Post[])
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async (postId: string) => {
    setLoadingComments(true)
    try {
      const { data, error } = await supabase
        .from("post_comments")
        .select(`
            *,
            farmers (name)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (error) throw error
      setActiveComments(data as unknown as Comment[])
    } catch (err) {
      console.error("Error fetching comments:", err)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && !newPostImage) return
    if (!currentFarmerId) return

    setIsPosting(true)
    try {
      let imageUrl = null

      // Upload Image if selected
      if (newPostImage) {
        const fileExt = newPostImage.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('community-images')
          .upload(filePath, newPostImage)

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('community-images')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      }

      // Insert Post
      const { error: insertError } = await supabase
        .from("community_posts")
        .insert({
          farmer_id: currentFarmerId,
          content: newPostContent,
          image_url: imageUrl
        })

      if (insertError) throw insertError

      setShowCreatePost(false)
      setNewPostContent("")
      setNewPostImage(null)

      // Manually fetch posts to ensure UI updates immediately
      await fetchPosts()

      // RLS Verification: Check if our new post is actually in the list
      const { data: verifyData } = await supabase
        .from("community_posts")
        .select("id")
        .eq("farmer_id", currentFarmerId)
        .order("created_at", { ascending: false })
        .limit(1)

      if (!verifyData || verifyData.length === 0) {
        alert("WARNING: Post created but NOT visible. This is likely a Database Permission (RLS) issue. Please fix Supabase policies for 'community_posts' table.")
      }
    } catch (err) {
      console.error("Error creating post:", err)
      alert("Failed to create post")
    } finally {
      setIsPosting(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!currentFarmerId) return

    // Check if already liked
    const post = posts.find(p => p.id === postId)
    const isLiked = post?.post_likes.some(l => l.farmer_id === currentFarmerId)

    try {
      if (isLiked) {
        // Unlike
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("farmer_id", currentFarmerId)
      } else {
        // Like
        await supabase
          .from("post_likes")
          .insert({
            post_id: postId,
            farmer_id: currentFarmerId
          })
      }
      // UI update handled by realtime
    } catch (err) {
      console.error("Error toggling like:", err)
    }
  }

  const handleCommentSubmit = async (postId: string) => {
    if (!commentText.trim() || !currentFarmerId) return

    try {
      const { error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          farmer_id: currentFarmerId,
          comment: commentText
        })

      if (error) throw error
      setCommentText("")
      // UI update handled by realtime
    } catch (err) {
      console.error("Error submitting comment:", err)
    }
  }

  const toggleComments = (postId: string) => {
    if (commentingOn === postId) {
      setCommentingOn(null)
      setActiveComments([])
    } else {
      setCommentingOn(postId)
      fetchComments(postId)
    }
  }

  const isLikedByMe = (post: Post) => {
    return post.post_likes?.some(l => l.farmer_id === currentFarmerId) || false
  }

  const handleShare = (post: Post) => {
    if (navigator.share) {
      navigator.share({
        title: `Post by ${post.farmers.name}`,
        text: post.content,
        url: window.location.href
      }).catch(() => { })
    } else {
      navigator.clipboard.writeText(`${post.content} - by ${post.farmers.name}`)
      alert("Copied to clipboard!")
    }
  }

  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return "Just now"
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return date.toLocaleDateString()
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
          <p className="text-muted-foreground">Connect with the farming community</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => fetchPosts()} title="Refresh Feed">
            <Loader2 className={loading ? "animate-spin" : ""} />
          </Button>
          <Button onClick={() => setShowCreatePost(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('community.createPost')}
          </Button>
        </div>
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
                className="w-full min-h-[150px] p-3 border rounded-md resize-none mb-4"
              />

              {newPostImage && (
                <div className="mb-4 relative">
                  <img src={URL.createObjectURL(newPostImage)} alt="Preview" className="h-32 rounded-md object-cover" />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6"
                    onClick={() => setNewPostImage(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setNewPostImage(e.target.files[0])
                    }}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost} disabled={(!newPostContent.trim() && !newPostImage) || isPosting}>
                    {isPosting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('community.post')}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">No posts yet. Be the first to share!</div>
        ) : (
          posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold uppercase">
                      {post.farmers?.name?.[0] || "u"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{post.farmers?.name || "Unknown Farmer"}</h3>
                          <p className="text-sm text-muted-foreground">{timeAgo(post.created_at)}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-base whitespace-pre-wrap">{post.content}</p>

                      {post.image_url && (
                        <div className="mt-3 rounded-md overflow-hidden bg-muted/20">
                          <img src={post.image_url} alt="Post content" className="w-full max-h-[400px] object-contain" />
                        </div>
                      )}

                      <div className="mt-4 flex items-center gap-6 border-t pt-4">
                        <Button
                          variant={isLikedByMe(post) ? "default" : "ghost"}
                          size="sm"
                          className="gap-2"
                          onClick={() => handleLike(post.id)}
                        >
                          <ThumbsUp className={`h-4 w-4 ${isLikedByMe(post) ? 'fill-current' : ''}`} />
                          {post.post_likes?.length || 0} {t('community.like')}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="gap-2"
                          onClick={() => toggleComments(post.id)}
                        >
                          <MessageSquare className="h-4 w-4" />
                          {post.post_comments?.length || 0} {t('community.comments')}
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

                      {/* Comments Section */}
                      <AnimatePresence>
                        {commentingOn === post.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-3 border-t pt-3"
                          >
                            <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto">
                              {loadingComments ? (
                                <div className="flex justify-center p-2"><Loader2 className="h-4 w-4 animate-spin" /></div>
                              ) : activeComments.length > 0 ? (
                                activeComments.map(comment => (
                                  <div key={comment.id} className="bg-muted/30 p-2 rounded-md">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="font-semibold text-sm">{comment.farmers?.name}</span>
                                      <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
                                    </div>
                                    <p className="text-sm">{comment.comment}</p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-center text-muted-foreground p-2">No comments yet</p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <Input
                                placeholder={t('community.writeComment')}
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post.id)}
                              />
                              <Button
                                size="icon"
                                onClick={() => handleCommentSubmit(post.id)}
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
          ))
        )}
      </div>
    </div>
  )
}
