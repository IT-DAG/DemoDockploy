# 🚀 Guía de Despliegue en Dockploy

Esta guía te llevará paso a paso para desplegar esta aplicación en Dockploy.

## 📋 Pre-requisitos

- ✅ Dockploy instalado y funcionando en `192.168.199.246`
- ✅ DNS configurado: `dockploy.domingoalonsoit.com` → `192.168.199.246`
- ✅ Repositorio en GitHub bajo la organización IT-DAG

## 🎯 Parte 1: Preparar el Repositorio en GitHub

### 1. Inicializar Git localmente

```bash
cd /Users/aartiles/Repos/DemoDocploy

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: Hello World app con Docker"
```

### 2. Crear repositorio en GitHub

1. Ve a GitHub: https://github.com/organizations/IT-DAG/repositories/new
2. Nombre del repositorio: `DemoDockploy`
3. Descripción: "Demo app para aprender despliegues con Dockploy y Docker"
4. Visibilidad: Público o Privado (según prefieras)
5. **NO** inicialices con README, .gitignore ni licencia (ya los tenemos)
6. Click en "Create repository"

### 3. Subir código a GitHub

```bash
# Agregar el remoto (reemplaza con la URL de tu repo)
git remote add origin https://github.com/IT-DAG/DemoDockploy.git

# Subir el código
git branch -M main
git push -u origin main
```

## 🐳 Parte 2: Despliegue Manual en Dockploy

### Paso 1: Acceder a Dockploy

1. Abre tu navegador y ve a: `http://dockploy.domingoalonsoit.com`
2. Inicia sesión con tus credenciales

### Paso 2: Crear un Nuevo Proyecto

1. Click en **"Create Project"** o **"New Project"**
2. Configuración:
   - **Project Name**: `DemoDockploy`
   - **Description**: "Aplicación de demo para aprendizaje"

### Paso 3: Agregar una Aplicación

1. Dentro del proyecto, click en **"Add Service"** o **"New Application"**
2. Selecciona **"Git Service"** o **"GitHub"**

### Paso 4: Configurar el Repositorio

1. **Repository URL**: `https://github.com/IT-DAG/DemoDockploy.git`
2. **Branch**: `main`
3. **Build Type**: Selecciona **"Dockerfile"**
4. **Dockerfile Path**: `./Dockerfile` (o déjalo por defecto)

### Paso 5: Configurar Variables de Entorno

En la sección de **Environment Variables**, agrega:

```
PORT=3000
BASE_PATH=/DemoDockploy
```

### Paso 6: Configurar el Dominio y Rutas

Esta es la parte **MUY IMPORTANTE** para que funcione con subdirectorios:

1. **Port**: `3000` (el puerto interno del contenedor)
2. **Domain**: `dockploy.domingoalonsoit.com`
3. **Path/Prefix**: `/DemoDockploy`

> **Nota**: La configuración exacta puede variar según la versión de Dockploy. Busca opciones como:
> - "Path Prefix"
> - "Base Path"
> - "Context Path"
> - En algunos casos, esto se configura en el Traefik Labels

### Paso 7: Configuración Avanzada (si es necesario)

Si Dockploy usa Traefik (que es común), es posible que necesites agregar labels personalizados:

```yaml
traefik.http.routers.demodockploy.rule=Host(`dockploy.domingoalonsoit.com`) && PathPrefix(`/DemoDockploy`)
traefik.http.middlewares.demodockploy-stripprefix.stripprefix.prefixes=/DemoDockploy
traefik.http.routers.demodockploy.middlewares=demodockploy-stripprefix
```

> **IMPORTANTE**: Si usas `StripPrefix`, entonces **NO** configures `BASE_PATH=/DemoDockploy` en las variables de entorno, déjalo vacío. El middleware quitará el prefijo antes de enviar la petición a tu app.

**Decisión a tomar:**

**Opción A: Sin StripPrefix** (Recomendado para este proyecto)
- Variable de entorno: `BASE_PATH=/DemoDockploy`
- La app maneja internamente todas las rutas con el prefijo
- Más control desde la aplicación

**Opción B: Con StripPrefix**
- Variable de entorno: `BASE_PATH=` (vacío o sin definir)
- Traefik quita el prefijo antes de enviar la petición
- Más simple, pero menos control

### Paso 8: Desplegar

1. Click en **"Deploy"** o **"Build & Deploy"**
2. Espera a que se construya la imagen Docker
3. Espera a que el contenedor se inicie
4. Verifica el estado en "healthy"

### Paso 9: Verificar el Despliegue

Abre tu navegador y ve a:
- **App principal**: `http://dockploy.domingoalonsoit.com/DemoDockploy`
- **Health check**: `http://dockploy.domingoalonsoit.com/DemoDockploy/health`
- **API Info**: `http://dockploy.domingoalonsoit.com/DemoDockploy/api/info`

Deberías ver la página de "¡Hola Mundo desde Docker!" con información del servidor.

## 🔄 Parte 3: Configurar Despliegue Automático (Opcional)

Para que Dockploy despliegue automáticamente cuando hagas push a GitHub:

### Opción 1: Webhooks de GitHub

1. En Dockploy, ve a la configuración de tu aplicación
2. Copia la **Webhook URL** que te proporciona Dockploy
3. Ve a tu repositorio en GitHub: `https://github.com/IT-DAG/DemoDockploy/settings/hooks`
4. Click en **"Add webhook"**
5. Configuración:
   - **Payload URL**: La URL del webhook de Dockploy
   - **Content type**: `application/json`
   - **Events**: Selecciona "Just the push event"
6. Click en **"Add webhook"**

### Opción 2: GitHub Actions (Más avanzado)

Puedes crear un workflow de GitHub Actions que notifique a Dockploy después de cada push. Esto lo podemos configurar más adelante si lo necesitas.

## 🧪 Probar el Flujo Completo

1. Haz un cambio en `server.js` (por ejemplo, cambia el texto "¡Hola Mundo!")
2. Commit y push:
   ```bash
   git add .
   git commit -m "Update: Cambio de texto de prueba"
   git push
   ```
3. Si configuraste el webhook, Dockploy debería detectar el cambio y redesplegar automáticamente
4. Espera unos minutos y verifica los cambios en tu navegador

## 📊 Troubleshooting

### Problema: La app no carga en `/DemoDockploy`

**Solución**: Verifica que:
1. La variable `BASE_PATH=/DemoDockploy` esté configurada
2. El path prefix esté configurado correctamente en Dockploy
3. No estés usando `StripPrefix` y `BASE_PATH` al mismo tiempo

### Problema: El contenedor no inicia (unhealthy)

**Solución**:
1. Revisa los logs en Dockploy
2. Verifica que el puerto 3000 esté correctamente mapeado
3. Asegúrate de que no haya conflictos de puertos

### Problema: 404 en todas las rutas

**Solución**:
1. Si usas `StripPrefix`, quita la variable `BASE_PATH`
2. Si no usas `StripPrefix`, asegúrate de que `BASE_PATH=/DemoDockploy` esté configurada

### Problema: El webhook no funciona

**Solución**:
1. Verifica que la URL del webhook sea correcta
2. Mira los "Recent Deliveries" en GitHub para ver si hay errores
3. Asegúrate de que Dockploy pueda recibir peticiones desde GitHub

## 📝 Notas Adicionales

- **Multiple Apps**: Para desplegar otra aplicación en `/otraapp`, repite el proceso con un nuevo proyecto y configura `BASE_PATH=/otraapp`
- **HTTPS**: Para producción, considera configurar SSL/TLS en Dockploy con Let's Encrypt
- **Logs**: Usa `docker logs` o la interfaz de Dockploy para ver los logs de la aplicación
- **Recursos**: Puedes limitar CPU y memoria en la configuración de Dockploy

## 🎓 Próximos Pasos

Una vez que domines este flujo básico, puedes:
1. Agregar múltiples ambientes (staging, production)
2. Configurar CI/CD más avanzado con GitHub Actions
3. Agregar bases de datos y otros servicios
4. Implementar monitoreo y alertas
