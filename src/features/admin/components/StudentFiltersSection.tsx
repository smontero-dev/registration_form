"use client";

import SearchBox from "../../../components/ui/SearchBox";

type FiltersSectionProps = {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showNewStudentsOnly: boolean;
  setShowNewStudentsOnly: (value: boolean) => void;
};

export default function FiltersSection({
  searchTerm,
  setSearchTerm,
  showNewStudentsOnly,
  setShowNewStudentsOnly,
}: FiltersSectionProps) {
  return (
    <>
      <SearchBox
        query={searchTerm}
        onQueryChange={setSearchTerm}
        placeholder="Buscar estudiantes..."
      />
      <div className="p-4 border-b bg-gray-50/70">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              id="new-students-filter"
              type="checkbox"
              checked={showNewStudentsOnly}
              onChange={(e) => setShowNewStudentsOnly(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="new-students-filter"
              className="ml-2 block text-sm text-gray-700 font-medium"
            >
              Solo estudiantes nuevos
            </label>
          </div>

          {/* Filter Status Indicator */}
          {(showNewStudentsOnly || searchTerm) && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500">Filtros activos:</span>
              {searchTerm && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  Búsqueda: &quot;{searchTerm}&quot;
                </span>
              )}
              {showNewStudentsOnly && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                  Solo nuevos
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowNewStudentsOnly(false);
                }}
                className="text-gray-400 hover:text-gray-600 underline"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
