type ToggleControlProps = {
  viewMode: "morning" | "both" | "afternoon";
  setViewMode: (mode: "morning" | "both" | "afternoon") => void;
};

export default function ToggleControl({
  viewMode,
  setViewMode,
}: ToggleControlProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => setViewMode("morning")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          viewMode === "morning"
            ? "bg-blue-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 14.596a.75.75 0 101.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 5.404a.75.75 0 101.06-1.06l-1.06-1.061a.75.75 0 00-1.06 1.06l1.06 1.06z"
              clipRule="evenodd"
            />
          </svg>
          <span>Mañana</span>
        </div>
      </button>

      <button
        onClick={() => setViewMode("both")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          viewMode === "both"
            ? "bg-purple-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center -space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 2zM10 15a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 15zM10 7a3 3 0 100 6 3 3 0 000-6zM15.657 5.404a.75.75 0 10-1.06-1.06l-1.061 1.06a.75.75 0 001.06 1.06l1.06-1.06zM6.464 14.596a.75.75 0 10-1.06-1.06l-1.06 1.06a.75.75 0 001.06 1.06l1.06-1.06zM18 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0118 10zM5 10a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 015 10zM14.596 14.596a.75.75 0 101.06-1.06l-1.06-1.061a.75.75 0 10-1.06 1.06l1.06 1.06zM5.404 5.404a.75.75 0 101.06-1.06l-1.06-1.061a.75.75 0 00-1.06 1.06l1.06 1.06z"
                clipRule="evenodd"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
          <span>Ambas</span>
        </div>
      </button>

      <button
        onClick={() => setViewMode("afternoon")}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
          viewMode === "afternoon"
            ? "bg-orange-600 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
        }`}
      >
        <div className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
          <span>Tarde</span>
        </div>
      </button>
    </div>
  );
}
