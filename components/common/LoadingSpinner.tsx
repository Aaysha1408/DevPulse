'use client'

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin">
        <div className="h-12 w-12 border-4 border-blue-200 border-t-blue-600 rounded-full" />
      </div>
      <span className="ml-4 text-gray-600">Loading...</span>
    </div>
  )
}