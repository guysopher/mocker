interface BriefViewProps {
  elements: any[]
  appDescription: string
  onElementClick: (id: string) => void
  activeElement: string | null
}

export const BriefView = ({ appDescription }: BriefViewProps) => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-4">Project Brief</h2>
      <div className="prose prose-slate">
        {appDescription || (
          <p className="text-gray-500 italic">
            No project description available. Please provide an app description to generate the brief.
          </p>
        )}
      </div>
    </div>
  )
} 