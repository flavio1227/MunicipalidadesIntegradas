# Instrucciones para subir el proyecto a GitHub

## Opción 1: Crear un nuevo repositorio en GitHub

1. Ve a GitHub y crea un nuevo repositorio (no inicialices con README, .gitignore o licencia)

2. En tu terminal, desde el directorio del proyecto, ejecuta:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

## Opción 2: Usar SSH (si tienes configuradas las llaves SSH)

```bash
git remote add origin git@github.com:TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

## Verificar el estado del repositorio

Para ver el estado actual del repositorio local:

```bash
git status
git log --oneline
```

## Comandos útiles para el futuro

### Hacer cambios y subirlos:
```bash
git add .
git commit -m "Descripción de los cambios"
git push
```

### Ver repositorios remotos configurados:
```bash
git remote -v
```

### Cambiar el nombre de la rama de master a main (si es necesario):
```bash
git branch -M main
```

## Nota importante

El archivo `.env` está en el .gitignore, por lo que NO se subirá al repositorio. Esto es correcto para mantener seguras las credenciales de Supabase.

Si alguien clona el repositorio, necesitará crear su propio archivo `.env` con las credenciales correspondientes.
