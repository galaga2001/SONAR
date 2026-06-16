import Filters from './Filters'
import WreckProfile from './WreckProfile'
import ResultsList from './ResultsList'

export default function Sidebar({
  filters,
  setFilters,
  nations,
  theaters,
  resultCount,
  results,
  selectedId,
  selectedWreck,
  onSelect,
  onCloseProfile,
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <Filters
        filters={filters}
        setFilters={setFilters}
        nations={nations}
        theaters={theaters}
        resultCount={resultCount}
      />
      <div className="flex-1 overflow-y-auto">
        {selectedWreck ? (
          <WreckProfile wreck={selectedWreck} onClose={onCloseProfile} />
        ) : (
          <ResultsList
            wrecks={results}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        )}
      </div>
    </div>
  )
}
