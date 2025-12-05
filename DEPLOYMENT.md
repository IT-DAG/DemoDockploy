# 🚀 Guía de Despliegue en Dockploy con Docker Compose

Esta guía te llevará paso a paso para desplegar esta aplicación en Dockploy usando **Docker Compose**.

## 📋 Pre-requisitos

- ✅ Dockploy instalado y funcionando en `192.168.199.246`
- ✅ DNS configurado: `dockploy.domingoalonsoit.com` → `192.168.199.246`
- ✅ Repositorio en GitHub: `https://github.com/IT-DAG/DemoDockploy`

## 🎯 ¿Por qué Docker Compose?

**Ventajas de usar Compose en Dockploy:**
- ✅ **Paridad local-producción**: El mismo `docker-compose.yml` funciona en ambos
- ✅ **Multi-servicio**: Fácil agregar BD, Redis, etc. en el futuro
- ✅ **Infraestructura como código**: Todo versionado en Git
- ✅ **Portable**: Migrar a otros servidores es trivial
- ✅ **Mantenible**: Cambios en un archivo vs configurar en la UI

## 🐳 Parte 1: Despliegue en Dockploy

### Paso 1: Acceder a Dockploy

1. Abre tu navegador y ve a: `http://dockploy.domingoalonsoit.com`
2. Inicia sesión con tus credenciales

### Paso 2: Crear un Nuevo Proyecto (Opcional pero recomendado)

1. Click en **"Create Project"** o **"New Project"**
2. Configuración:
   - **Project Name**: `DemoDockploy`
   - **Description**: "Aplicación de demo para aprendizaje con Docker Compose"

> **📝 Nota**: Los proyectos ayudan a organizar múltiples servicios. Puedes saltarte este paso y crear el servicio directamente.

### Paso 3: Crear Servicio con Compose

1. Click en **"+ Create Service"**
2. Selecciona **"Compose"**
3. En el formulario "Create Compose":
   - **Name**: `web` (o el nombre que prefieras para el servicio)
   - **App Name**: `demodockploy-web` (se genera automático, puedes cambiarlo)
   - **Compose Type**: Deja `Docker Compose` (por defecto)
   - **Description**: "Demo app Hello World con Node.js"
4. Click en **"Create"**

### Paso 4: Configurar Git/GitHub

Después de crear el servicio, verás la pantalla de configuración. Aquí es donde conectas con GitHub:

1. Busca la sección **"Source"**, **"Repository"** o **"Git"**
2. Configuración:
   - **Provider**: Selecciona **"GitHub"** o **"Git"**
   - **Repository URL**: `https://github.com/IT-DAG/DemoDockploy.git`
   - **Branch**: `main`
   - **Compose File Path**: `docker-compose.yml` (por defecto, puede estar autodetectado)

> **💡 Nota**: Si no ves estas opciones inmediatamente, busca tabs o secciones como:
> - "Source"
> - "Git"
> - "Repository"
> - "Settings"

### Paso 5: Configurar Dominio y Rutas

En la sección de **Domains** o **Routing** del servicio:

1. **Domain**: `dockploy.domingoalonsoit.com`
2. **Path** o **Path Prefix**: `/DemoDockploy`
3. **Container Port**: `3000` (el puerto interno del contenedor)

> **⚠️ Importante**: La configuración puede variar según la versión de Dockploy. Busca:
> - Path Prefix / Base Path / Context Path
> - Port mapping / Container Port
> - Traefik Labels (avanzado)

### Paso 6: Configurar Variables de Entorno (Opcional)

Si necesitas sobrescribir alguna variable del `docker-compose.yml`, búscalas en la sección **Environment Variables**:

```
NODE_ENV=production
```

> **📝 Nota**: No necesitas agregar `PORT` ni `BASE_PATH` aquí porque ya están definidas en el `docker-compose.yml`.

### Paso 7: Guardar Configuración

1. Click en **"Save"** o **"Apply"** para guardar la configuración
2. Asegúrate de que todos los campos estén correctos

### Paso 8: Desplegar

1. Click en **"Deploy"**, **"Build & Deploy"** o el botón equivalente
2. Dockploy ejecutará:
   ```bash
   git clone https://github.com/IT-DAG/DemoDockploy.git
   cd DemoDockploy
   docker-compose up --build -d
   ```
3. Espera a que se construya la imagen (puede tomar 1-2 minutos la primera vez)
4. Monitorea los logs para ver el progreso
5. Verifica que el estado sea "healthy" o "running"

### Paso 9: Verificar el Despliegue

Abre tu navegador y ve a:
- **App principal**: `http://dockploy.domingoalonsoit.com/DemoDockploy`
- **Health check**: `http://dockploy.domingoalonsoit.com/DemoDockploy/health`
- **API Info**: `http://dockploy.domingoalonsoit.com/DemoDockploy/api/info`

Deberías ver la página de "¡Hola Mundo desde Docker!" 🎉

## 🔄 Parte 2: Configurar Despliegue Automático

### Opción 1: Webhooks de GitHub (Recomendado)

1. En Dockploy, ve a la configuración de tu servicio Compose
2. Copia la **Webhook URL** (algo como: `http://dockploy.domingoalonsoit.com/api/webhook/...`)
3. Ve a tu repositorio en GitHub: `https://github.com/IT-DAG/DemoDockploy/settings/hooks`
4. Click en **"Add webhook"**
5. Configuración:
   - **Payload URL**: La URL del webhook de Dockploy
   - **Content type**: `application/json`
   - **Events**: Selecciona "Just the push event"
   - **Active**: ✅ Marcado
6. Click en **"Add webhook"**

Ahora cada vez que hagas `git push`, Dockploy automáticamente:
1. Detectará el cambio
2. Hará `git pull`
3. Ejecutará `docker-compose up --build -d`
4. Desplegará la nueva versión

### Opción 2: Despliegue Manual

Si prefieres control manual, simplemente:
1. Haz tus cambios localmente
2. `git push` a GitHub
3. En Dockploy, click en **"Redeploy"** o **"Rebuild"**

## 🧪 Parte 3: Probar el Flujo Completo

### Test 1: Cambio Simple

1. Edita `server.js` localmente, cambia el texto "¡Hola Mundo!"
2. Prueba en local:
   ```bash
   docker-compose -f docker-compose.local.yml up --build
   ```
3. Verifica en: `http://localhost:3000`
4. Si funciona, haz commit y push:
   ```bash
   git add server.js
   git commit -m "Update: Cambio de texto de prueba"
   git push
   ```
5. Si configuraste webhook, espera ~30 segundos
6. Verifica en: `http://dockploy.domingoalonsoit.com/DemoDockploy`

### Test 2: Cambio en docker-compose.yml

1. Edita `docker-compose.yml`, por ejemplo agrega una variable:
   ```yaml
   environment:
     - BASE_PATH=/DemoDockploy
     - VERSION=2.0
   ```
2. Prueba en local con el compose de producción:
   ```bash
   docker-compose up --build
   ```
3. Verifica en: `http://localhost:3000/DemoDockploy`
4. Push y verifica en Dockploy

## 📊 Troubleshooting

### Problema: El servicio no inicia

**Síntomas**: El contenedor se crea pero muestra "unhealthy" o "exited"

**Solución**:
1. En Dockploy, ve a los **logs** del servicio
2. Busca errores en:
   ```bash
   docker-compose logs
   ```
3. Verifica que el `docker-compose.yml` es válido:
   ```bash
   docker-compose config
   ```

### Problema: 404 en `/DemoDockploy`

**Síntomas**: La app carga pero no en el subdirectorio

**Solución**:
1. Verifica que `BASE_PATH=/DemoDockploy` esté en el `docker-compose.yml`
2. Verifica que la ruta esté configurada en Dockploy (Traefik)
3. Revisa los logs para ver qué rutas está manejando la app

### Problema: El webhook no funciona

**Síntomas**: Push a GitHub pero Dockploy no despliega

**Solución**:
1. Ve a GitHub → Settings → Webhooks → Recent Deliveries
2. Verifica que la respuesta sea `200 OK`
3. Si es `404` o `500`, revisa la URL del webhook
4. Asegúrate de que Dockploy pueda recibir peticiones desde GitHub

### Problema: Cambios no se reflejan

**Síntomas**: Desplegaste pero ves la versión antigua

**Solución**:
1. Dockploy cachea imágenes. Fuerza rebuild:
   ```bash
   docker-compose up --build --force-recreate
   ```
2. En Dockploy, busca opción "Rebuild" o "Force deploy"
3. Verifica que esté usando la rama correcta (`main`)

### Problema: Port already in use

**Síntomas**: Error "port 3000 is already allocated"

**Solución**:
1. Otro servicio usa el puerto 3000
2. Cambia el puerto en `docker-compose.yml`:
   ```yaml
   ports:
     - "3001:3000"  # Puerto externo:interno
   ```
3. Actualiza la configuración en Dockploy

## 🎓 Próximos Pasos

### 1. Agregar una Base de Datos

Cuando estés listo para expandir:

```yaml
# docker-compose.yml
services:
  app:
    # ... configuración existente
    depends_on:
      - postgres
    environment:
      - DB_HOST=postgres
  
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  db_data:
```

### 2. Múltiples Aplicaciones

Para desplegar otra app en `/otraapp`:
1. Crear nuevo repositorio
2. Crear nuevo servicio Compose en Dockploy
3. Configurar path `/otraapp`

### 3. Configurar HTTPS

Para producción real:
1. Dockploy/Traefik soporta Let's Encrypt automático
2. Configura tu dominio con certificado SSL
3. Cambia las URLs a `https://`

### 4. Monitoreo y Logs

- Usa los logs de Dockploy para debugging
- Considera agregar herramientas como:
  - Prometheus + Grafana para métricas
  - Loki para logs centralizados
  - Uptime Kuma para monitoring

## 📝 Diferencias: Compose vs Application

Si en el futuro te preguntas por qué usamos Compose:

| Aspecto | Application | Compose ✅ |
|---------|------------|-----------|
| Config en GUI | ✅ | ❌ |
| Multi-servicio | ❌ Manual | ✅ Automático |
| Paridad local | ❌ | ✅ |
| Versionado | Parcial | ✅ Total |
| Escalabilidad | Limitada | ✅ Alta |
| Migración | Difícil | ✅ Fácil |

## 🌐 URLs de Referencia

- **Repositorio GitHub**: https://github.com/IT-DAG/DemoDockploy
- **Dockploy**: http://dockploy.domingoalonsoit.com
- **App desplegada**: http://dockploy.domingoalonsoit.com/DemoDockploy
- **Health check**: http://dockploy.domingoalonsoit.com/DemoDockploy/health

---

¡Listo para desplegar! 🚀 Si tienes problemas, revisa la sección de Troubleshooting o los logs en Dockploy.
