import { forwardRef, useImperativeHandle, useRef } from 'react'

export const Preview = forwardRef<HTMLIFrameElement>((_props, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useImperativeHandle(ref, () => iframeRef.current as HTMLIFrameElement)

  return (
    <div className="flex-1 bg-white">
      <iframe
        ref={iframeRef}
        id="preview-frame"
        title="Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  )
})

Preview.displayName = 'Preview'