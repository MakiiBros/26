# 🧠 Memoria de Prompts y Contexto del Proyecto — MakiBros

Este archivo sirve como **memoria persistente** de las instrucciones del usuario, decisiones tomadas, estado de dependencias y arquitectura del proyecto, permitiendo retomar el contexto rápidamente en cualquier sesión sin tener que reescanear todo el repositorio.

---

## 📌 1. Ficha Técnica del Proyecto
* **Nombre:** MakiBros (`makisbros`)
* **Framework:** Next.js 16.3.4 (App Router) + React 19.2.8
* **Lenguaje:** TypeScript 5
* **Estilos:** Tailwind CSS v4 + Framer Motion
* **Base de datos & Auth:** Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
* **3D / Gráficos:** Three.js (`@types/three`, `three`)
* **Pasarela de Pagos:** Mercado Pago (`mercadopago` Node SDK v3.6, `@mercadopago/sdk-react` v1.0.7)
* **Gestión de Estado:** Zustand v5
* **Validación:** Zod v4

---

## ⚙️ 2. Skills Activas en el Workspace (`.agent/skills/`)
1. **`antigravity-skills-manager`** (de `rmyndharis/antigravity-skills`): Gestor local y global para buscar e instalar skills del ecosistema Antigravity.
2. **`antigravity-skill-orchestrator`** (de `sickn33/agentic-awesome-skills`): Meta-skill de orquestación inteligente que evalúa tareas y activa skills pertinentes.
3. **`antigravity-workflows`** (de `sickn33/agentic-awesome-skills`): Flujos guiados para arquitectura, MVPs, QA y seguridad.

---

## 📜 3. Registro Histórico de Prompts y Acciones

### Prompt 1: Saludo inicial
* **Usuario:** *"hola"*
* **Acción:** Saludo y disponibilidad para asistir en el desarrollo.

### Prompt 2: Verificación de Skills
* **Usuario:** *"puedes verificar que skills estan en este repositorio?"*
* **Acción:** Inspección del repositorio `/workspaces/26`. Se identificó que no existían skills locales, únicamente las reglas de `AGENTS.md` y `CLAUDE.md`.

### Prompt 3: Instalación de `rmyndharis/antigravity-skills`
* **Usuario:** *"instala esta skill en mi proyecto. https://github.com/rmyndharis/antigravity-skills"*
* **Acción:** Se analizó el repositorio (bóveda de 307 skills). Se instaló la skill gestora `antigravity-skills-manager` en `.agent/skills/antigravity-skills-manager` y se probó la CLI `@rmyndharis/antigravity-skills`.

### Prompt 4 & 5: Consulta y reversión de `sickn33/agentic-awesome-skills`
* **Usuario:** *"tambien estas skills. https://github.com/sickn33/agentic-awesome-skills"*
* **Acción:** Tras consulta, el usuario solicitó instalar todo el catálogo. Se copiaron 2,022 skills en `.agent/skills/`.
* **Usuario:** *"mejor quita sickn33/agentic-awesome-skills"*
* **Acción:** Se depuraron y eliminaron inmediatamente las 2,022 carpetas y archivos satélites, dejando el repositorio limpio y conservando solo `antigravity-skills-manager`.

### Prompt 6: Instalación selectiva de meta-skills
* **Usuario:** *"instala esta skills en mi proyecto. sickn33/agentic-awesome-skills"*
* **Acción:** Se acordó no volcar las 2,000 carpetas y en su lugar se instalaron las dos meta-skills oficiales para Antigravity (`antigravity-skill-orchestrator` y `antigravity-workflows`) usando el instalador `npx agentic-awesome-skills`.

### Prompt 7: Memoria y Migración a Checkout API de Mercado Pago
* **Usuario:** 
  1. *"a partir de ahora crear un .md de todo los promts usados, como memoria , asi no estara revisando todo el proyecto."*
  2. *"hace poco hicimos mercado pago , para pagar con yape , pero no era muy configurable, quiero cambiarlo a Checkout API de mercado pago"*
* **Acción:** 
  1. Creación de este documento (`PROMPTS_MEMORY.md`).
  2. Implementación completa de **Checkout API (Checkout Transparente)**:
     - Frontend nativo en `src/app/(public)/checkout/page.tsx` con tabs para Yape (código OTP de 6 dígitos con ayuda visual), Tarjeta (tokenización directa con SDK de Mercado Pago y detección de marca) y Efectivo (WhatsApp).
     - Backend en `src/app/api/process_payment/route.ts` con manejo robusto de `payer.email`, `notification_url`, guardado de `payment_id` en Supabase y mapeo de errores amigables.
     - Compilación y tipado validados con `npm run build` exitoso.

---

## 🏗️ 4. Estado de Pasarela de Pagos (Mercado Pago)
* **Implementación Activa:** **Checkout API (Checkout Transparente)**
  * **Yape:** Formulario nativo con input de celular y código OTP de 6 dígitos obtenido desde la app de Yape (sin redirección ni popups).
  * **Tarjetas:** Formulario nativo oscuro con validación y tokenización cliente vía `createCardToken` de Mercado Pago JS (PCI Compliant).
  * **Efectivo:** Flujo WhatsApp con resumen estructurado del pedido.
  * **Backend:** `POST /api/process_payment` ejecuta `Payment.create(...)` con el SDK de Mercado Pago, registrando la orden en Supabase y retornando mensajes de rechazo claros si el OTP o tarjeta no son válidos.
  * **Webhook:** `POST /api/webhooks/mercadopago` escucha notificaciones asíncronas de Mercado Pago para marcar órdenes pagadas en Supabase (`orders`).

### Prompt 8: Error en Yape y configuración de entorno
* **Usuario:** *"por que no me deja pagar?"*, *"hazlo tu mismo . yo te dare la key del token"*
* **Acción:** 
  1. Se analizó el error "Error interno procesando el pago" y se determinó que faltaban las credenciales de Mercado Pago en el entorno (`MERCADOPAGO_ACCESS_TOKEN`), provocando un error 401 que era ocultado por el SDK.
  2. Se mejoró el manejo de errores en `src/app/api/process_payment/route.ts` para devolver mensajes claros si falta el token o si Mercado Pago rechaza la petición.
  3. Se creó el archivo `.env.local` con las credenciales de Producción/Test provistas por el usuario para solucionar el error de autenticación.
