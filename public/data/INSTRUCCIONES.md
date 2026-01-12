# Instrucciones para Actualizar Datos

## Cómo actualizar el mapa de municipalidades

1. Edita el archivo `municipalidades.csv` en esta carpeta (`/public/data/`)
2. Guarda los cambios
3. Ejecuta en tu terminal:
   ```bash
   git add .
   git commit -m "Actualizar datos de municipalidades"
   git push
   ```
4. Los cambios se reflejarán automáticamente al recargar la página

## Formato del Archivo CSV

El archivo debe mantener este formato exacto:

```csv
departamento,municipio,status,fecha,observaciones
Atlántida,La Ceiba,Integrado,2024-01-15,Sistema operativo
Cortés,San Pedro Sula,En proceso,2024-02-20,En capacitación
```

### Columnas requeridas:
- **departamento**: Nombre del departamento
- **municipio**: Nombre del municipio
- **status**: Estado del municipio (ver valores permitidos abajo)
- **fecha**: Fecha (opcional, puede estar vacía)
- **observaciones**: Notas adicionales (opcional, puede estar vacía)

## Estados Válidos para "status"

- **Integrado**: El municipio aparecerá como SOLVENTE (verde en el mapa)
- **En proceso**: El municipio aparecerá como INSOLVENTE (amarillo en el mapa)
- **No integrado**: El municipio aparecerá como INSOLVENTE (amarillo en el mapa)

## Ejemplo Completo

```csv
departamento,municipio,status,fecha,observaciones
Atlántida,La Ceiba,Integrado,2024-01-15,Sistema operativo
Atlántida,Tela,Integrado,2024-02-20,Integración completa
Atlántida,Jutiapa,No integrado,,Pendiente de recursos
Cortés,San Pedro Sula,Integrado,2023-11-01,Sistema operativo
Cortés,Choloma,En proceso,2024-02-15,En capacitación
Francisco Morazán,Tegucigalpa,Integrado,2023-10-01,Sistema operativo
```

## Notas Importantes

- NO cambies el nombre del archivo (debe ser `municipalidades.csv`)
- NO modifiques los encabezados de las columnas
- Mantén el formato CSV (comas como separadores)
- Los valores de "status" NO distinguen mayúsculas/minúsculas
- La aplicación carga los datos automáticamente al iniciar
