import { useState, useEffect } from 'react';
import TablaMunicipios from './components/TablaMunicipios';
import MapaHonduras from './components/MapaHonduras';
import { MapPin } from 'lucide-react';
import { MunicipioData, DepartmentStats } from './types/data';

function App() {
  const [municipios, setMunicipios] = useState<MunicipioData[]>([]);
  const [departmentStats, setDepartmentStats] = useState<Map<string, DepartmentStats>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const calculateDepartmentStats = (municipiosData: MunicipioData[]): Map<string, DepartmentStats> => {
    const statsMap = new Map<string, DepartmentStats>();

    municipiosData.forEach((muni) => {
      if (!statsMap.has(muni.departamento)) {
        statsMap.set(muni.departamento, {
          departamento: muni.departamento,
          solventes: 0,
          insolventes: 0,
          total: 0,
          status: 'sin_datos',
        });
      }

      const stats = statsMap.get(muni.departamento)!;
      stats.total++;

      if (muni.solvente) {
        stats.solventes++;
      } else {
        stats.insolventes++;
      }
    });

    // Calculate status for each department
    statsMap.forEach((stats) => {
      if (stats.total === 0) {
        stats.status = 'sin_datos';
      } else if (stats.solventes >= 1) {
        stats.status = 'solvente';
      } else {
        stats.status = 'insolvente';
      }
    });

    return statsMap;
  };

  const loadDataFromCSV = async () => {
    try {
      const response = await fetch('/data/municipalidades.csv');
      if (!response.ok) {
        throw new Error('No se encontró el archivo de datos');
      }

      const csvText = await response.text();
      const lines = csvText.trim().split('\n');

      if (lines.length < 2) {
        throw new Error('El archivo CSV está vacío');
      }

      const parsedMunicipios: MunicipioData[] = lines
        .slice(1)
        .filter(line => line.trim())
        .map(line => {
          const [departamento, municipio, status] = line.split(',').map(s => s.trim());
          return {
            departamento,
            municipio,
            solvente: status.toUpperCase() === 'INTEGRADO',
          };
        })
        .filter(m => m.departamento && m.municipio);

      if (parsedMunicipios.length === 0) {
        throw new Error('No se encontraron datos válidos');
      }

      setMunicipios(parsedMunicipios);
      const stats = calculateDepartmentStats(parsedMunicipios);
      setDepartmentStats(stats);
      setLoading(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError('Error al cargar datos: ' + errorMessage);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDataFromCSV();
  }, []);

  const globalStats = {
    total: municipios.length,
    solventes: municipios.filter((m) => m.solvente).length,
    insolventes: municipios.filter((m) => !m.solvente).length,
    departamentos: departmentStats.size,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Municipalidades Integradas al SIGEM
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                República de Honduras
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <p className="text-blue-800 text-lg font-medium">
              Cargando datos...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!loading && municipios.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Total Municipios</div>
                <div className="mt-2 text-3xl font-bold text-gray-900">{globalStats.total}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Solventes</div>
                <div className="mt-2 text-3xl font-bold text-green-600">{globalStats.solventes}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Insolventes</div>
                <div className="mt-2 text-3xl font-bold text-yellow-600">{globalStats.insolventes}</div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm font-medium text-gray-600">Departamentos</div>
                <div className="mt-2 text-3xl font-bold text-blue-600">{globalStats.departamentos}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <MapaHonduras departmentStats={departmentStats} />

              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Detalle de Municipios
                </h2>
                <TablaMunicipios municipios={municipios} />
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-600">
            Sistema de Municipalidades Integradas al SIGEM - Honduras
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
