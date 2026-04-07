// UserProfile.tsx - 用户个人主页
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProjectStore } from '@/stores/projectStore'

export function UserProfile() {
  const { projects } = useProjectStore()
  const [activeTab, setActiveTab] = useState<'works' | 'likes' | 'settings'>('works')

  const stats = {
    works: projects.length,
    likes: 0,
    views: 0
  }

  return (
    <div className="min-h-screen text-white pb-20">
      {/* 头部背景 */}
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-pink-900/40 to-cyan-900/30" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* 用户信息 */}
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div className="glass-card p-6 mb-6">
          <div className="flex items-end gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center text-4xl shadow-xl border-4 border-[#12121a]">
              🌸
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-black grad-text mb-1">特效创作者</h1>
              <p className="text-sm text-white/40">@creator</p>
            </div>
            <button className="btn-ghost text-xs py-2 px-4">
              ✏️ 编辑资料
            </button>
          </div>

          {/* 统计 */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-white/5">
            {[
              { label: '作品', value: stats.works },
              { label: '获赞', value: stats.likes },
              { label: '浏览', value: stats.views },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-xs text-white/40 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 标签页 */}
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 mb-6">
          {[
            { key: 'works', icon: '🎨', label: '我的作品' },
            { key: 'likes', icon: '❤️', label: '喜欢' },
            { key: 'settings', icon: '⚙️', label: '设置' },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key
                  ? 'bg-gradient-to-r from-pink-500/80 to-purple-500/80 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <span>{t.icon}</span>
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* 内容区 */}
        {activeTab === 'works' && (
          <div>
            {projects.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">🎨</div>
                <p className="text-white/40 mb-4">还没有作品</p>
                <Link to="/editor/new" className="btn-primary text-xs py-2 px-6">
                  创建第一个特效
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {projects.map(p => (
                  <Link
                    key={p.id}
                    to={`/editor/${p.id}`}
                    className="glass-card p-4 hover:border-pink-500/30 transition-colors"
                  >
                    <div className="aspect-video bg-white/5 rounded-lg mb-3 flex items-center justify-center text-3xl">
                      ✨
                    </div>
                    <h3 className="font-bold text-sm truncate">{p.title}</h3>
                    <p className="text-xs text-white/30 mt-1">
                      {new Date(p.updatedAt ?? p.createdAt ?? Date.now()).toLocaleDateString('zh-CN')}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'likes' && (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">❤️</div>
            <p className="text-white/40">还没有喜欢的特效</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-bold text-sm mb-4">账号设置</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-sm text-white/60">昵称</span>
                <span className="text-sm">特效创作者</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <span className="text-sm text-white/60">邮箱</span>
                <span className="text-sm text-white/40">未绑定</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-white/60">深色模式</span>
                <span className="text-sm">🌙 自动</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
