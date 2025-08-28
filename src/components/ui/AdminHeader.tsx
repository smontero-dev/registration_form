import { AuthEventData } from "@aws-amplify/ui";
import { useAdminMode } from "@/contexts/AdminModeContext";

type AdminHeaderProps = {
  signOut: ((data?: AuthEventData | undefined) => void) | undefined;
};

export default function AdminHeader({ signOut }: AdminHeaderProps) {
  const { mode, setMode } = useAdminMode();

  return (
    <header className="flex items-center justify-between bg-[#1e213a] px-8 py-4 text-white">
      <div className="flex items-center space-x-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>

        {/* Mode Toggle */}
        <div className="flex bg-white/10 rounded-lg p-1 backdrop-blur-sm">
          <button
            onClick={() => setMode('students')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'students'
                ? 'bg-white text-[#1e213a] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>Estudiantes</span>
            </div>
          </button>

          <button
            onClick={() => setMode('routes')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mode === 'routes'
                ? 'bg-white text-[#1e213a] shadow-sm'
                : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
          >
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              <span>Rutas</span>
            </div>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Current Mode Indicator */}
        <div className="flex items-center space-x-2 text-sm text-white/80">
          <div className={`w-2 h-2 rounded-full ${mode === 'students' ? 'bg-blue-400' : 'bg-indigo-400'
            }`}></div>
          <span>
            Gestionando {mode === 'students' ? 'Estudiantes' : 'Rutas'}
          </span>
        </div>

        <button
          onClick={signOut}
          className="cursor-pointer rounded-md bg-white px-6 py-3 font-bold text-[#1e213a] transition-colors hover:bg-gray-100"
        >
          Cerrar Sesión
        </button>
      </div>
    </header>
  );
}
