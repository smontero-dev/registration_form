export default function RegistrationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="bg-[#1e213a] p-6">
        <h1 className="text-3xl font-bold text-white">
          Registro de Estudiante
        </h1>
        <p className="mt-2 text-gray-300">
          Por favor complete toda la información requerida para el registro de
          transporte escolar
        </p>
      </div>

      {/* Progress indicator */}
      {/* <FormProgress steps={steps} currentStep={currentStep} /> */}

      {/* Form */}
      {children}
    </div>
  );
}
