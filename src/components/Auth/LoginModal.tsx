import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Loader2, Mail, Lock, UserPlus, LogIn } from 'lucide-react'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const { login, register, loading, error } = useAuthStore()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isRegister && password !== confirmPassword) {
      alert('两次密码输入不一致')
      return
    }
    try {
      if (isRegister) {
        await register(email, password)
      } else {
        await login(email, password)
      }
      onClose()
    } catch (e) {
      // error handled in store
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg p-6 w-96 border border-[#3c3c3c]">
        <h2 className="text-xl font-semibold text-white mb-4">
          {isRegister ? '注册账号' : '登录账号'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">邮箱</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#3c3c3c] text-white pl-10 pr-3 py-2 rounded outline-none focus:ring-1 focus:ring-[#0078d4]"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">密码</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#3c3c3c] text-white pl-10 pr-3 py-2 rounded outline-none focus:ring-1 focus:ring-[#0078d4]"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-sm text-gray-400 mb-1">确认密码</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#3c3c3c] text-white pl-10 pr-3 py-2 rounded outline-none focus:ring-1 focus:ring-[#0078d4]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0078d4] text-white py-2 rounded font-medium hover:bg-[#1177bb] disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={20} className="animate-spin mx-auto" />
            ) : isRegister ? (
              <span className="flex items-center justify-center gap-2">
                <UserPlus size={18} /> 注册
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn size={18} /> 登录
              </span>
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-sm text-[#0078d4] hover:underline"
          >
            {isRegister ? '已有账号？立即登录' : '没有账号？立即注册'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full text-gray-400 text-sm hover:text-white"
        >
          取消
        </button>
      </div>
    </div>
  )
}