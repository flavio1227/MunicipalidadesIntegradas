# Sistema de Municipalidades Integradas al SIGEM - Honduras

Dashboard interactivo para visualizar el estatus de integración de municipalidades al SIGEM en Honduras.

## Características

- Visualización interactiva del mapa de Honduras con colores por departamento
- Tabla detallada de todos los municipios con filtros
- Estadísticas globales (total, solventes, insolventes)
- Carga automática de datos desde archivo CSV en el repositorio
- Actualización simple mediante git push

## Cómo Actualizar los Datos

### Paso 1: Editar el Archivo CSV

Edita el archivo ubicado en:
```
/public/data/municipalidades.csv
```

El formato debe ser:

```csv
departamento,municipio,status,fecha,observaciones
Atlántida,La Ceiba,Integrado,2024-01-15,Sistema operativo
Cortés,San Pedro Sula,En proceso,2024-02-20,En capacitación
```

**Valores permitidos para "status":**
- `Integrado`: Municipio solvente (verde)
- `En proceso` o `No integrado`: Municipio insolvente (amarillo)

### Paso 2: Subir los Cambios

```bash
git add .
git commit -m "Actualizar datos de municipalidades"
git push
```

### Paso 3: Ver los Cambios

Recarga la página y los nuevos datos aparecerán automáticamente.

## Lógica de Colores en el Mapa

- **Verde**: Departamento con al menos 1 municipio solvente
- **Amarillo**: Departamento con todos los municipios insolventes
- **Gris**: Departamento sin datos

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Tecnologías

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (iconos)

## Estructura del Proyecto

```
/
├── public/
│   ├── data/
│   │   ├── municipalidades.csv      # Archivo de datos (editable)
│   │   └── INSTRUCCIONES.md         # Guía detallada
│   └── maps/
│       └── honduras_departamentos.svg
├── src/
│   ├── components/
│   │   ├── MapaHonduras.tsx         # Visualización del mapa
│   │   └── TablaMunicipios.tsx      # Tabla con filtros
│   ├── types/
│   │   └── data.ts                  # Definiciones TypeScript
│   └── App.tsx                      # Componente principal
└── README.md
```

## Solución de Problemas

### "No se encontró el archivo de datos"

- Verifica que el archivo esté en `/public/data/municipalidades.csv`
- Asegúrate de que el nombre sea exactamente `municipalidades.csv`

### El mapa no muestra colores

- Verifica que los nombres de departamento coincidan con los oficiales
- Revisa que la columna `status` tenga valores válidos: "Integrado", "En proceso", o "No integrado"

### Los cambios no se reflejan

- Haz hard refresh (Ctrl+F5 o Cmd+Shift+R)
- Verifica que hiciste git push correctamente

## Contacto y Soporte

Para más información, consulta:
- `/public/data/INSTRUCCIONES.md` - Guía paso a paso para actualizar datos
