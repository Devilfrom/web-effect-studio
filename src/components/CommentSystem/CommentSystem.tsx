// CommentSystem.tsx - 评论系统
import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore'

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  createdAt: Date
  likes: number
}

export function CommentSystem({ effectId }: { effectId: string }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(
      collection(db, 'effects', effectId, 'comments'),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(q, (snap) => {
      setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Comment)))
      setLoading(false)
    })
    return unsub
  }, [effectId])

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    await addDoc(collection(db, 'effects', effectId, 'comments'), {
      author: '匿名用户',
      avatar: '🌸',
      content: newComment,
      createdAt: serverTimestamp(),
      likes: 0
    })
    setNewComment('')
  }

  return (
    <div className="glass-card p-5 mt-6">
      <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
        <span>💬</span>
        <span>评论</span>
        <span className="text-xs text-white/40 bg-white/5 px-2 py-0.5 rounded-full">{comments.length}</span>
      </h3>

      {/* 评论列表 */}
      <div className="space-y-4 mb-5 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8 text-white/30 text-sm">加载中...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-white/30 text-sm">暂无评论，来抢沙发吧~</div>
        ) : (
          comments.map(c => (
            <div key={c.id} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-sm shrink-0">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white/70">{c.author}</span>
                  <span className="text-[10px] text-white/30">
                    {c.createdAt?.toLocaleDateString?.() || '刚刚'}
                  </span>
                </div>
                <p className="text-sm text-white/60 leading-relaxed">{c.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="text-[11px] text-white/30 hover:text-pink-400 transition-colors">
                    ❤️ {c.likes || 0}
                  </button>
                  <button className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                    回复
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 输入框 */}
      <div className="flex gap-3">
        <input
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="写下你的评论..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-pink-500/50"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          disabled={!newComment.trim()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </div>
  )
}
