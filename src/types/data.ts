export interface MunicipioData {
  departamento: string;
  municipio: string;
  solvente: boolean;
}

export interface DepartmentStats {
  departamento: string;
  solventes: number;
  insolventes: number;
  total: number;
  status: 'solvente' | 'insolvente' | 'sin_datos';
}

export interface ExcelRow {
  departamento: string;
  municipio: string;
  estatus: string;
}
