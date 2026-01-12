import { useEffect, useRef, useState } from 'react';
import { DepartmentStats } from '../types/data';

interface MapaHondurasProps {
  departmentStats: Map<string, DepartmentStats>;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  departamento: string;
  stats: DepartmentStats | null;
}

// Mapping from SVG path IDs to department names
const DEPARTMENT_ID_MAP: Record<string, string> = {
  'HNAT': 'Atlántida',
  'HNCH': 'Choluteca',
  'HNCL': 'Colón',
  'HNCM': 'Comayagua',
  'HNCP': 'Copán',
  'HNCR': 'Cortés',
  'HNEP': 'El Paraíso',
  'HNFM': 'Francisco Morazán',
  'HNGD': 'Gracias a Dios',
  'HNIB': 'Islas de la Bahía',
  'HNIN': 'Intibucá',
  'HNLE': 'Lempira',
  'HNLP': 'La Paz',
  'HNOC': 'Ocotepeque',
  'HNOL': 'Olancho',
  'HNSB': 'Santa Bárbara',
  'HNVA': 'Valle',
  'HNYO': 'Yoro',
};

export default function MapaHonduras({ departmentStats }: MapaHondurasProps) {
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    departamento: '',
    stats: null,
  });

  // Determine department color based on status
  const getDepartmentColor = (stats: DepartmentStats | undefined): string => {
    if (!stats || stats.status === 'sin_datos') {
      return '#BDBDBD'; // Gray
    }
    if (stats.status === 'solvente') {
      return '#2E7D32'; // Green
    }
    return '#F9A825'; // Yellow
  };

  useEffect(() => {
    if (!svgContainerRef.current) return;

    // Load SVG map
    fetch('/maps/honduras_departamentos.svg')
      .then((response) => response.text())
      .then((svgText) => {
        if (!svgContainerRef.current) return;

        svgContainerRef.current.innerHTML = svgText;
        const svgElement = svgContainerRef.current.querySelector('svg');

        if (!svgElement) return;

        svgElement.setAttribute('width', '100%');
        svgElement.setAttribute('height', '100%');

        const departments = svgElement.querySelectorAll('path[id]');

        departments.forEach((dept) => {
          const deptId = dept.id;
          const deptName = DEPARTMENT_ID_MAP[deptId];

          if (!deptName) return;

          const stats = departmentStats.get(deptName);
          const color = getDepartmentColor(stats);

          // Apply styling - DO NOT modify the path itself
          dept.setAttribute('fill', color);
          dept.setAttribute('stroke', '#ffffff');
          dept.setAttribute('stroke-width', '0.5');
          dept.setAttribute('cursor', 'pointer');
          dept.setAttribute('class', 'department-path');

          // Mouse enter event
          dept.addEventListener('mouseenter', (e) => {
            const mouseEvent = e as MouseEvent;
            const containerRect = svgContainerRef.current?.getBoundingClientRect();

            dept.setAttribute('stroke-width', '1.5');
            dept.setAttribute('filter', 'brightness(0.9)');

            if (containerRect) {
              setTooltip({
                visible: true,
                x: mouseEvent.clientX - containerRect.left,
                y: mouseEvent.clientY - containerRect.top,
                departamento: deptName,
                stats: stats || null,
              });
            }
          });

          // Mouse move event
          dept.addEventListener('mousemove', (e) => {
            const mouseEvent = e as MouseEvent;
            const containerRect = svgContainerRef.current?.getBoundingClientRect();

            if (containerRect) {
              setTooltip((prev) => ({
                ...prev,
                x: mouseEvent.clientX - containerRect.left,
                y: mouseEvent.clientY - containerRect.top,
              }));
            }
          });

          // Mouse leave event
          dept.addEventListener('mouseleave', () => {
            dept.setAttribute('stroke-width', '0.5');
            dept.removeAttribute('filter');
            setTooltip((prev) => ({ ...prev, visible: false }));
          });
        });
      })
      .catch((error) => {
        console.error('Error al cargar el SVG:', error);
      });
  }, [departmentStats]);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Mapa de Cumplimiento por Departamento
        </h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#2E7D32' }}></div>
            <span className="text-gray-700">Solvente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F9A825' }}></div>
            <span className="text-gray-700">Insolvente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#BDBDBD' }}></div>
            <span className="text-gray-700">Sin datos</span>
          </div>
        </div>
      </div>
      <div className="relative h-[500px] w-full" ref={svgContainerRef}>
        {tooltip.visible && (
          <div
            className="absolute pointer-events-none z-10 bg-white text-black px-3 py-2 rounded shadow-lg text-sm border border-gray-200"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y + 10}px`,
            }}
          >
            <div className="font-semibold mb-1">{tooltip.departamento}</div>
            {!tooltip.stats || tooltip.stats.total === 0 ? (
              <div className="text-gray-600">Sin datos</div>
            ) : (
              <>
                <div>Solventes: {tooltip.stats.solventes}</div>
                <div>Insolventes: {tooltip.stats.insolventes}</div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
