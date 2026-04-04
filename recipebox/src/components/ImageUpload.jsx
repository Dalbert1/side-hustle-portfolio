import { useState, useRef } from 'react'
import { Camera, X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export default function ImageUpload({ value, onChange, path, label = 'Upload Photo' }) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef(null)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const filePath = `${user.id}/${path}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('recipe-photos')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('recipe-photos')
        .getPublicUrl(filePath)

      onChange(data.publicUrl + '?t=' + Date.now())
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    onChange(null)
  }

  return (
    <div className="relative">
      {value ? (
        <div className="relative rounded-xl overflow-hidden bg-cream-dark">
          <img src={value} alt="" className="w-full aspect-[4/3] object-cover" />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-bark hover:bg-white transition-colors shadow-sm"
              aria-label="Replace photo"
            >
              <Camera size={14} />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="w-8 h-8 bg-white/90 rounded-lg flex items-center justify-center text-terra hover:bg-white transition-colors shadow-sm"
              aria-label="Remove photo"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-sage/40 bg-cream-dark flex flex-col items-center justify-center gap-2 transition-colors"
        >
          {uploading ? (
            <Loader2 size={24} className="text-sage animate-spin" />
          ) : (
            <>
              <Camera size={24} className="text-warm-gray-light" />
              <span className="text-xs text-warm-gray">{label}</span>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  )
}
