# 🍔 Penca Mundial Kanthus — Deploy en Netlify

## Pasos para desplegar en Netlify

### 1. Base de datos PostgreSQL externa

Netlify no incluye PostgreSQL. Necesitás una base de datos externa. Opciones gratuitas:

| Servicio | URL | Plan gratis |
|---|---|---|
| **Neon** | https://neon.tech | 0.5 GB, ideal para empezar |
| **Supabase** | https://supabase.com | 500 MB, muy estable |
| **Railway** | https://railway.app | $5 crédito mensual |

**Recomendación: Neon.tech** — Es la más fácil y rápida.

#### Crear base de datos en Neon:
1. Andá a https://neon.tech y creá una cuenta gratis
2. Creá un nuevo proyecto
3. Copiá el **Connection String** (empieza con `postgresql://...`)

---

### 2. Subir código a GitHub

```bash
git init
git add .
git commit -m "Penca Mundial Kanthus - primera versión"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/penca-kanthus.git
git push -u origin main
```

---

### 3. Conectar con Netlify

1. Andá a https://app.netlify.com y creá una cuenta (o logueate con GitHub)
2. Hacé clic en **"Add new site"** → **"Import an existing project"**
3. Seleccioná tu repositorio de GitHub (`penca-kanthus`)
4. Netlify detecta automáticamente la configuración de `netlify.toml`
5. **IMPORTANTE**: Configurá las variables de entorno:

#### Variables de entorno en Netlify:
Andá a **Site settings** → **Environment variables** → **Add a variable**:

| Key | Value |
|---|---|
| `DATABASE_URL` | Tu connection string de Neon/Supabase |

Ejemplo de DATABASE_URL:
```
postgresql://usuario:contraseña@ep-xxx-xxx.region.aws.neon.tech/app_db?sslmode=require
```

6. Hacé clic en **"Deploy site"**

---

### 4. Crear tablas en la base de datos

Una vez que el deploy termine, necesitás crear las tablas. Tenés dos opciones:

#### Opción A: Desde tu terminal local
```bash
# Instalá Drizzle Kit si no lo tenés
npm install -g drizzle-kit

# Seteá la variable de entorno
export DATABASE_URL="postgresql://tu-connection-string"

# Pusheá el schema
npx drizzle-kit push
```

#### Opción B: Usar el endpoint de seed
Después del deploy, hacé un POST a tu URL de Netlify:
```bash
curl -X POST https://tu-sitio.netlify.app/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"adminKey":"kanthus2026"}'
```

Esto crea los 49 partidos del Mundial automáticamente.

---

### 5. ¡Listo! 🎉

Tu penca estará disponible en:
```
https://tu-sitio.netlify.app
```

---

## Configuración adicional

### Dominio personalizado
En Netlify: **Domain settings** → **Add custom domain** → Seguí los pasos.

### Cambiar número de WhatsApp
Editá el archivo `src/components/WhatsAppButton.tsx` y cambiá:
```typescript
const whatsappNumber = "59899000000"; // ← Tu número real
```

### Cargar resultados de partidos (Admin)
```bash
curl -X POST https://tu-sitio.netlify.app/api/admin/result \
  -H "Content-Type: application/json" \
  -d '{"matchId":1,"scoreA":2,"scoreB":1,"adminKey":"kanthus2026"}'
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── api/              # API routes (auth, matches, predictions, ranking, admin)
│   ├── login/            # Página de login
│   ├── predictions/      # Página de predicciones
│   ├── ranking/          # Página de ranking
│   ├── register/         # Página de registro
│   ├── page.tsx          # Home (hero, cómo funciona, premios, reglas)
│   ├── layout.tsx        # Layout con navbar
│   └── globals.css       # Estilos (tema oscuro + verde neón)
├── components/
│   ├── Navbar.tsx        # Barra de navegación
│   └── WhatsAppButton.tsx # Botón flotante de WhatsApp
└── db/
    ├── index.ts          # Cliente de base de datos
    └── schema.ts         # Tablas (users, matches, predictions)
```

---

## Colores Kanthus

| Color | Código | Uso |
|---|---|---|
| Negro fondo | `#0a0a0a` | Background principal |
| Verde neón | `#00ff88` | Acentos, botones, highlights |
| Blanco | `#ffffff` | Texto principal |
| Gris | `#a0a0a0` | Texto secundario |
