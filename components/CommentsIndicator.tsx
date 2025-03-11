import { FC } from 'react'

interface CommentsIndicatorProps {
  progress?: number // Optional progress percentage (0-100)
}

export const CommentsIndicator: FC<CommentsIndicatorProps> = ({ progress }) => {
  return (
    <div className="absolute top-0 right-0 inset-0 flex items-center justify-center">
      <div className="w-12 h-12 relative">
        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
        <div
          className="absolute inset-0 border-4 border-blue-500 rounded-full animate-progress-circle"
          style={{
            clipPath: 'inset(0 0 0 50%)',
            transform: 'rotate(0deg)',
          }}
        ></div>
      </div>
    </div>
  )
} 