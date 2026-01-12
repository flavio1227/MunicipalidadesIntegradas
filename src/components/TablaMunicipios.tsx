import { useState, useMemo } from 'react';
import { ArrowUpDown, Search } from 'lucide-react';
import { MunicipioData } from '../types/data';

interface TablaMunicipiosProps {
  municipios: MunicipioData[];
}

type SortField = 'departamento' | 'municipio' | 'solvente';
type SortDirection = 'asc' | 'desc';

export default function TablaMunicipios({ municipios }: TablaMunicipiosProps) {
  const [sortField, setSortField] = useState<SortField>('departamento');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterDepartamento, setFilterDepartamento] = useState<string>('');
  const [filterEstatus, setFilterEstatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter municipios
  const filteredMunicipios = useMemo(() => {
    return municipios.filter((muni) => {
      const matchesDepartamento = filterDepartamento === '' || muni.departamento === filterDepartamento;
      const matchesEstatus = filterEstatus === '' ||
        (filterEstatus === 'solvente' && muni.solvente) ||
        (filterEstatus === 'insolvente' && !muni.solvente);
      const matchesSearch = searchQuery === '' ||
        muni.departamento.toLowerCase().includes(searchQuery.toLowerCase()) ||
        muni.municipio.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDepartamento && matchesEstatus && matchesSearch;
    });
  }, [municipios, filterDepartamento, filterEstatus, searchQuery]);

  // Sort municipios
  const sortedMunicipios = useMemo(() => {
    return [...filteredMunicipios].sort((a, b) => {
      let comparison = 0;

      if (sortField === 'solvente') {
        comparison = (a.solvente === b.solvente) ? 0 : a.solvente ? -1 : 1;
      } else {
        const aValue = a[sortField];
        const bValue = b[sortField];
        comparison = aValue.localeCompare(bValue, 'es');
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filteredMunicipios, sortField, sortDirection]);

  // Get unique departments for filter dropdown
  const uniqueDepartamentos = useMemo(() => {
    return Array.from(new Set(municipios.map(m => m.departamento))).sort((a, b) =>
      a.localeCompare(b, 'es')
    );
  }, [municipios]);

  const getStatusBadge = (solvente: boolean) => {
    if (solvente) {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Solvente
        </span>
      );
    }
    return (
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Insolvente
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Municipio o Departamento
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre de municipio o departamento..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Departamento
            </label>
            <select
              value={filterDepartamento}
              onChange={(e) => setFilterDepartamento(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los departamentos</option>
              {uniqueDepartamentos.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Estatus
            </label>
            <select
              value={filterEstatus}
              onChange={(e) => setFilterEstatus(e.target.value)}
              className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos los estatus</option>
              <option value="solvente">Solvente</option>
              <option value="insolvente">Insolvente</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          Mostrando {sortedMunicipios.length} de {municipios.length} municipios
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                #
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('departamento')}
              >
                <div className="flex items-center gap-2">
                  Departamento
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('municipio')}
              >
                <div className="flex items-center gap-2">
                  Municipio
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('solvente')}
              >
                <div className="flex items-center gap-2">
                  Estatus de cumplimiento
                  <ArrowUpDown className="w-4 h-4" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMunicipios.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No se encontraron municipios con los filtros seleccionados
                </td>
              </tr>
            ) : (
              sortedMunicipios.map((muni, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                    {muni.numeroIntegracion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {muni.departamento}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {muni.municipio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(muni.solvente)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
