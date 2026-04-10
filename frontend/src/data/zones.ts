export interface Project {
  id: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  tech: string;
  github: string;
  featured?: boolean;
}

export interface ZoneContent {
  title: string;
  body: string;
  type?: "minigame" | "reward" | string;
  projects?: Project[];
  game?: string;
  bgImage?: string;
  minigameInfo?: string;
  minigameCost?: string;
}

export const contentMap: Record<string, ZoneContent> = {
  backend: {
    title: "BACKEND ENGINEERING",
    body: `<p class="lore-text">
    Backends robustos enfocados en seguridad, autenticación,
    arquitectura limpia y escalabilidad. APIs en Rust y Python
    listos para producción.
    </p>`,
    projects: [
      {
        id: "real_time_betting_validation_api",
        name: "High-Concurrency API",
        summary: "Validación de apuestas en tiempo real con Rust.",
        description:
          "API en Rust diseñada para validar apuestas deportivas en tiempo real bajo cargas extremas. Implementa arquitectura hexagonal, concurrencia segura y baja latencia.",
        image: "https://via.placeholder.com/600x400/1a1a1a/f1c40f?text=Rust+High+Concurrency",
        tech: "Rust, Actix Web, SQLx, PostgreSQL, Docker, k6",
        github: "https://github.com/JoanixX/real_time_betting_validation_api",
        featured: true,
      },
      {
        id: "secure_banking_auth_service",
        name: "Secure Banking Auth Service",
        summary: "Autenticación bancaria segura.",
        description:
          "Servicio profesional de autenticación y autorización para entornos bancarios, con manejo de JWT y refresh tokens, revocación segura, roles y auditoría.",
        image: "https://via.placeholder.com/600x400/1a1a1a/e74c3c?text=Secure+Auth",
        tech: "Rust, Actix Web, PostgreSQL, Redis, JWT, Argon2",
        github: "https://github.com/JoanixX/secure_banking_auth_service",
      },
      {
        id: "process_automation_backend_platform",
        name: "Process Automation Platform",
        summary: "Automatización modular escalable.",
        description:
          "Plataforma backend modular en Rust diseñada para soportar automatización de procesos internos empresariales, siguiendo DDD/Hexagonal.",
        image: "https://via.placeholder.com/600x400/1a1a1a/3498db?text=Automation+Platform",
        tech: "Rust, DDD, Hexagonal, PostgreSQL, Docker",
        github: "https://github.com/JoanixX/process_automation_backend_platform",
      },
      {
        id: "betting_ai_model_orchestration_api",
        name: "AI Model Orchestration API",
        summary: "Orquestación de modelos de IA.",
        description:
          "API modular en FastAPI diseñada para orquestar múltiples modelos de IA especializados en predicciones deportivas, con registro y versionamiento.",
        image: "https://via.placeholder.com/600x400/1a1a1a/9b59b6?text=AI+Orchestration",
        tech: "Python, FastAPI, Redis, PostgreSQL, Clean Architecture",
        github: "https://github.com/JoanixX/betting_ai_model_orchestration_api",
      },
    ],
  },
  datascience: {
    title: "DATA SCIENCE",
    body: `<p class="lore-text">
    Análisis de datos reales con énfasis en limpieza, modelado, métricas y toma de decisiones.
    Aplicación de técnicas estadísticas y de machine learning para resolver problemas de negocio.
    </p>`,
    projects: [
      {
        id: "financial_transaction_fraud_detection",
        name: "Fraud Detection System",
        summary: "Detección de fraude en fintech.",
        description:
          "Plataforma profesional para análisis, scoring y detección de fraude en transacciones financieras. Incluye arquitectura hexagonal y workflow de ML profesional.",
        image: "https://via.placeholder.com/600x400/1a1a1a/27ae60?text=Fraud+Detection",
        tech: "Python, FastAPI, Docker, ML Workflow, EDA, Architecture",
        github: "https://github.com/JoanixX/financial_transaction_fraud_detection",
        featured: true,
      },
      {
        id: "political_data_peru",
        name: "Scraper Presidential Candidates Peru",
        summary: "Ingeniería de datos para transparencia política.",
        description:
          "Plataforma para recolectar, versionar y normalizar información pública sobre candidatos presidenciales. Incluye scraping modular y pipelines ETL.",
        image: "https://via.placeholder.com/600x400/1a1a1a/f39c12?text=Political+Data",
        tech: "Python, FastAPI, SQL, Docker, ETL Pipelines",
        github: "https://github.com/JoanixX/political_data_peru",
      },
      {
        id: "user_player_segmentation",
        name: "User / Player Segmentation",
        summary: "Segmentación para decisiones de negocio.",
        description:
          "Plataforma para analizar y segmentar comportamientos de usuarios en negocios digitales. Base profesional para retención y monetización.",
        image: "https://via.placeholder.com/600x400/1a1a1a/1abc9c?text=User+Segmentation",
        tech: "Python, FastAPI, Analytics, Docker, Hexagonal Architecture",
        github: "https://github.com/JoanixX/player_segmentation",
      },
    ],
  },
  ai: {
    title: "AI & ML DEVELOPMENT",
    body: `<p class="lore-text">
    Desarrollo de modelos de inteligencia artificial aplicados a visión por computadora,
    procesamiento de lenguaje natural y sistemas de scoring, con evaluación rigurosa
    y enfoque en explicabilidad.
    </p>`,
    projects: [
      {
        id: "AutoScan",
        name: "AutoScan (Computer Vision)",
        summary: "Detección de placas vehiculares con YOLO.",
        description:
          "Sistema de Computer Vision especializado en detección de placas. Incluye arquitectura hexagonal, microservicios internos y pipelines de inferencia.",
        image: "https://via.placeholder.com/600x400/1a1a1a/c0392b?text=AutoScan+CV",
        tech: "Python, FastAPI, PostgreSQL, Docker, YOLO, Hexagonal",
        github: "https://github.com/MauColab/Autoscan/tree/carlitos",
        featured: true,
      },
      {
        id: "student_dropout_scoring_model",
        name: "Explainable Classification Model",
        summary: "Predicción de riesgo de abandono escolar.",
        description:
          "Sistema de scoring explicable para predecir riesgo de abandono académico mediante XGBoost y explicabilidad con SHAP/LIME.",
        image: "https://via.placeholder.com/600x400/1a1a1a/d35400?text=Scoring+Model",
        tech: "Python, FastAPI, XGBoost, SHAP/LIME, PostgreSQL, Docker",
        github: "https://github.com/JoanixX/student_dropout_scoring_model",
      },
      {
        id: "bot_comment_classifier",
        name: "NLP Classification System",
        summary: "Detección de spam y lenguaje tóxico.",
        description:
          "Sistema de clasificación de comentarios para detectar spam, bots y lenguaje tóxico usando transformadores y pipelines de preprocesamiento.",
        image: "https://via.placeholder.com/600x400/1a1a1a/2980b9?text=NLP+Classifier",
        tech: "Python, FastAPI, Transformers, NLP, PostgreSQL, Docker",
        github: "https://github.com/JoanixX/bot_comment_classifier",
      },
    ],
  },
  hub: {
    title: "INTEGRATION HUB",
    body: `<p class="lore-text">
    Sistemas integrados donde convergen backend, frontend, inteligencia artificial
    y análisis de datos. Además de el diseño de aplicaciones completas con enfoque
    en arquitectura, escalabilidad y toma de decisiones automatizada.
    </p>`,
    projects: [
      {
        id: "smart_expense_management_system",
        name: "Smart Expense Management",
        summary: "Gestión financiera con OCR e IA.",
        description:
          "Plataforma empresarial para procesar y auditar gastos operativos mediante OCR, normalización de datos y detección de anomalías.",
        image: "https://via.placeholder.com/600x400/1a1a1a/2ecc71?text=Smart+Expenses",
        tech: "FastAPI, PostgreSQL, OCR, Anomaly Detection, Docker",
        github: "https://github.com/JoanixX/smart_expense_management_system",
        featured: true,
      },
      {
        id: "intelpulse_agent",
        name: "AI Contextual Intelligence Agent",
        summary: "Agente inteligente con RAG y Scraping.",
        description:
          "Backend y frontend estructural de un agente con arquitectura hexagonal, RAG, scraping y dashboards en tiempo real.",
        image: "https://via.placeholder.com/600x400/1a1a1a/8e44ad?text=IntelPulse+Agent",
        tech: "Rust, React, PostgreSQL, Docker, RAG, Scraping",
        github: "https://github.com/JoanixX/intelpulse_agent",
      },
      {
        id: "candidate_ranking_platform",
        name: "Intelligent Candidate Ranking",
        summary: "Ranking de candidatos mediante NLP.",
        description:
          "Plataforma de ranking inteligente de candidatos con backend estructurado, NLP base y plantillas de scoring modular.",
        image: "https://via.placeholder.com/600x400/1a1a1a/16a085?text=Candidate+Ranking",
        tech: "Python, FastAPI, NLP, PostgreSQL, Docker, CI/CD",
        github: "https://github.com/JoanixX/candidate_ranking_platform",
      },
    ],
  },
  experience: {
    title: "EXPERIENCIA",
    body: `<p class="lore-text">Experiencia actual dentro del campo laboral.</p>`,
    projects: [
      {
        id: "e1",
        name: "Kreante (NoCode)",
        summary: "Practicante de Desarrollo No-Code.",
        description: "Desarrollo de MVPs funcionales.",
        image: "https://via.placeholder.com/300x200/222/fff?text=Kreante",
        tech: "Bubble",
        github: "#",
      },
      {
        id: "e2",
        name: "Chambea Ya (CTO)",
        summary: "AI Platform.",
        description: "Plataforma para conectar estudiantes.",
        image: "https://via.placeholder.com/300x200/222/fff?text=ChambeaYa",
        tech: "FastAPI, PyTorch, API OpenAI, Sentence-Transformers, NLTK, React, Axios, Google OAuth, Qdrant, PostgreSQL, JWT, Arquitectura Hexagonal",
        github: "#",
      },
    ],
  },
  easter_egg: {
    type: "reward",
    title: "TE DISTE CUENTA",
    body: `<p class="lore-text">Si, la imagen la expandí con IA, por eso aparece el logo de gemini.
Se supone que sería obvio, pero por el pixelart y eso parece medio oculto.
Que lo hayas encontrado dice mucho sobre ti querido usuario: andas buscando secretos donde no 
había ninguno.
Así que felicidades, activaste un easter egg irrelevante. No hay historia ni impacto alguno, 
solo unas monedas para comprarte un skin, que es, evidentemente, totalmente necesario.
</p>`,
  },
  // nuevos minijuegos
  lake: {
    type: "minigame",
    game: "fishing",
    bgImage: "lake_minigame.png",
    title: "LAGO DE PESCA - LA SERENIDAD DEL CÓDIGO",
    body: `<p class="lore-text">Un lago dinámico donde los recursos (peces) fluyen constantemente. Debes sincronizar tu "hook" para capturar los datos valiosos sin chocar con basura (latas) que corrompen tu memoria.</p>
               <p><strong>Instrucciones:</strong> <br>
               1. <strong>ESPACIO</strong> para lanzar el anzuelo. Todo se detendrá, y <strong>ESPACIO</strong> de nuevo para recogerlo.<br>
               2. ¡Cuidado al subir! Si una lata te golpea mientras recoges, perderás el pez.<br>
               3. Si tocas una lata al bajar, pierdes 15 puntos. Si bajas de 0 puntos, Game Over.</p>`,
    minigameCost: "Costo: 75 monedas | Gana hasta 150 | Tiempo: 60s",
    minigameInfo: "VALOR DE PECES: 🐟: 15 | 🐠: 25 | 🐡: 35 | 🥫: -15",
  },
  farm: {
    type: "minigame",
    game: "farm",
    bgImage: "farm_minigame.png",
    title: "GRANJA DE POLLOS - CONTROL DE PROCESOS",
    body: `<p class="lore-text">Una granja caótica donde los pollos corren sin control, simulando transacciones desbordadas en un servidor. Tu misión es etiquetar (disparar huevos) a los procesos correctos (pollos) sin afectar a los servicios críticos (otros animales).</p>
               <p><strong>Instrucciones:</strong> Usa el mouse para apuntar y clic para disparar. Evita a las vacas y cerdos o perderás puntos de rendimiento.</p>`,
    minigameCost: "Costo de entrada: 75 monedas",
    minigameInfo: "PROCESOS: 🐥: +10 | 🐷: -20 | 🐮: -50",
  },
  magic_tree: {
    type: "minigame",
    game: "connect4",
    bgImage: "magicTree_minigame.png",
    title: "ÁRBOL MÁGICO - ESTRUCTURAS DE DATOS",
    body: `<p class="lore-text">Bajo las ramas de este antiguo árbol binario, el sabio Linus Torvalds te retará a un duelo de lógica pura. No es solo suerte; es un algoritmo minimax en acción.</p>
               <p><strong>Instrucciones:</strong> El clásico 4 en Línea. Conecta 4 fichas antes que la IA. Si ganas, duplicas tu apuesta. Si pierdes, te vas con las manos vacías.</p>`,
    minigameCost: "Costo de entrada: 75 monedas | Premio: Doble o Nada",
    minigameInfo: "DIFICULTAD: Algoritmo Minimax | TIEMPO: Ilimitado",
  },
  garden: {
    type: "minigame",
    game: "quiz",
    bgImage: "garden_minigame.png",
    title: "JARDÍN DEL SABER - QUIZ TECH",
    body: `<p class="lore-text">Un jardín floreciente donde cada flor es una pregunta de conocimiento. Desde punteros en C++ hasta la historia de los mundiales de fútbol. Solo los verdaderos full-stack sobrevivirán.</p>
               <p><strong>Instrucciones:</strong> Responde 5 preguntas aleatorias. Cada acierto te da monedas, cada fallo te resta vida.</p>`,
    minigameCost: "Costo de entrada: 75 monedas",
    minigameInfo: "PREGUNTAS: 5 | CATEGORÍAS: Tech, Historia, Ciencia",
  },
};