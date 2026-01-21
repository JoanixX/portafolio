export interface Project {
  id: string;
  name: string;
  summary: string;
  description: string;
  image: string;
  tech: string;
  github: string;
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
        id: "b1",
        name: "High-Concurrency Rust API",
        summary: "Backend de alto rendimiento.",
        description:
          "API desarrollada en Rust diseñada para manejar alta concurrencia, con manejo eficiente de memoria, pooling de conexiones y pruebas de carga.",
        image: "https://via.placeholder.com/300x200/222/ffd43b?text=Rust+API",
        tech: "Rust, Actix-Web, PostgreSQL, SQLx",
        github: "#",
      },
      {
        id: "b2",
        name: "Secure Authentication Service",
        summary: "Autenticación y control de acceso.",
        description:
          "Servicio de autenticación con JWT, refresh tokens, roles y protección contra ataques comunes (token replay, brute force).",
        image: "https://via.placeholder.com/300x200/222/ffd43b?text=Auth+Security",
        tech: "Python, FastAPI, JWT, Redis",
        github: "#",
      },
      {
        id: "b3",
        name: "Scalable Backend Architecture",
        summary: "Arquitectura y escalabilidad.",
        description:
          "Backend diseñado bajo principios de arquitectura limpia, separación de capas, servicios desacoplados y escalabilidad horizontal.",
        image: "https://via.placeholder.com/300x200/222/ffd43b?text=Architecture",
        tech: "FastAPI, PostgreSQL, Docker",
        github: "#",
      },
      {
        id: "b4",
        name: "AI Model Orchestration API",
        summary: "Orquestación de modelos.",
        description:
          "Backend encargado de gestionar versiones de modelos de IA, cachear resultados, controlar costos y exponer endpoints consistentes.",
        image: "https://via.placeholder.com/300x200/222/ffd43b?text=AI+Orchestration",
        tech: "Python, FastAPI, Redis, PostgreSQL",
        github: "#",
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
        id: "d1",
        name: "Fraud Detection Analysis",
        summary: "Detección de comportamiento fraudulento.",
        description:
          "Análisis de reseñas falsas mediante ingeniería de características, NLP y modelos supervisados, evaluados con métricas como F1 y ROC-AUC.",
        image: "https://via.placeholder.com/300x200/222/4dabf7?text=Fraud+Detection",
        tech: "Python, LightGBM, TF-IDF, SHAP",
        github: "#",
      },
      {
        id: "d2",
        name: "Player Segmentation Strategy",
        summary: "Clustering con criterio de negocio.",
        description:
          "Segmentación de usuarios usando K-Means y DBSCAN sobre datos ruidosos, combinando métricas técnicas con análisis estratégico para toma de decisiones.",
        image: "https://via.placeholder.com/300x200/222/4dabf7?text=Clustering",
        tech: "Python, Scikit-learn, Pandas",
        github: "#",
      },
      {
        id: "d3",
        name: "Demand Forecasting & Decision Making",
        summary: "Predicción y simulación.",
        description:
          "Modelo de forecasting con series temporales complementado con simulaciones para evaluar escenarios y apoyar decisiones operativas.",
        image: "https://via.placeholder.com/300x200/222/4dabf7?text=Forecasting",
        tech: "Python, Statsmodels, Prophet",
        github: "#",
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
        id: "a1",
        name: "Vehicle Plate Detection System",
        summary: "Visión por computadora.",
        description:
          "Modelo de detección de placas vehiculares entrenado con deep learning, evaluado bajo métricas de precisión y robustez en distintos escenarios.",
        image: "https://via.placeholder.com/300x200/222/ffd43b?text=Computer+Vision",
        tech: "PyTorch, YOLOv8, OpenCV",
        github: "#",
      },
      {
        id: "a2",
        name: "Explainable Scoring Model",
        summary: "ML explicable.",
        description:
          "Modelo de scoring entrenado sobre datos estructurados con explicabilidad mediante SHAP para entender el impacto de cada variable.",
        image: "https://via.placeholder.com/300x200/222/ffd43b?text=Explainable+AI",
        tech: "Python, XGBoost, SHAP",
        github: "#",
      },
      {
        id: "a3",
        name: "NLP Classification System",
        summary: "Procesamiento de lenguaje natural.",
        description:
          "Modelo de NLP para clasificación de textos utilizando embeddings y técnicas de vectorización evaluadas con métricas estándar.",
        image: "https://via.placeholder.com/300x200/222/ffd43b?text=NLP",
        tech: "Python, Transformers, Scikit-learn",
        github: "#",
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
        id: "h1",
        name: "Intelligent Candidate Ranking Platform",
        summary: "Sistema de matching inteligente.",
        description:
          "Plataforma full-stack que analiza perfiles y descripciones mediante NLP, genera rankings explicables y aprende del feedback de usuarios.",
        image: "https://via.placeholder.com/300x200/222/69db7c?text=Ranking+System",
        tech: "FastAPI, NLP, PostgreSQL, Frontend Web",
        github: "#",
      },
      {
        id: "h2",
        name: "Smart Expense Management System",
        summary: "Gestión financiera con IA.",
        description:
          "Sistema que clasifica gastos automáticamente, detecta anomalías y predice comportamientos financieros futuros.",
        image: "https://via.placeholder.com/300x200/222/69db7c?text=Smart+Finance",
        tech: "FastAPI, OCR, Time Series, Frontend Web",
        github: "#",
      },
      {
        id: "h3",
        name: "AI-Powered Notification & Decision Engine",
        summary: "Automatización inteligente.",
        description:
          "Sistema que procesa información entrante, la clasifica por prioridad y ejecuta acciones automatizadas basadas en reglas y modelos de IA.",
        image: "https://via.placeholder.com/300x200/222/69db7c?text=AI+Automation",
        tech: "FastAPI, NLP, Background Workers, Frontend Dashboard",
        github: "#",
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
    bgImage: "/lake_minigame.png",
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
    game: "placeholder",
    bgImage: "/farm_minigame.png",
    title: "GRANJA DE POLLOS - CONTROL DE PROCESOS",
    body: `<p class="lore-text">Una granja caótica donde los pollos corren sin control, simulando transacciones desbordadas en un servidor. Tu misión es etiquetar (disparar huevos) a los procesos correctos (pollos) sin afectar a los servicios críticos (otros animales).</p>
               <p><strong>Instrucciones:</strong> Usa el mouse para apuntar y clic para disparar. Evita a las vacas y cerdos o perderás puntos de rendimiento.</p>`,
    minigameCost: "Costo de entrada: 75 monedas",
    minigameInfo: "PROCESOS: 🐥: +10 | 🐷: -20 | 🐮: -50",
  },
  magic_tree: {
    type: "minigame",
    game: "placeholder",
    bgImage: "/magicTree_minigame.png",
    title: "ÁRBOL MÁGICO - ESTRUCTURAS DE DATOS",
    body: `<p class="lore-text">Bajo las ramas de este antiguo árbol binario, el sabio Linus Torvalds te retará a un duelo de lógica pura. No es solo suerte; es un algoritmo minimax en acción.</p>
               <p><strong>Instrucciones:</strong> El clásico 4 en Línea. Conecta 4 fichas antes que la IA. Si ganas, duplicas tu apuesta. Si pierdes, te vas con las manos vacías.</p>`,
    minigameCost: "Costo de entrada: 75 monedas | Premio: Doble o Nada",
    minigameInfo: "DIFICULTAD: Algoritmo Minimax | TIEMPO: Ilimitado",
  },
  garden: {
    type: "minigame",
    game: "placeholder",
    bgImage: "/garden_minigame.png",
    title: "JARDÍN DEL SABER - QUIZ TECH",
    body: `<p class="lore-text">Un jardín floreciente donde cada flor es una pregunta de conocimiento. Desde punteros en C++ hasta la historia de los mundiales de fútbol. Solo los verdaderos full-stack sobrevivirán.</p>
               <p><strong>Instrucciones:</strong> Responde 5 preguntas aleatorias. Cada acierto te da monedas, cada fallo te resta vida.</p>`,
    minigameCost: "Costo de entrada: 75 monedas",
    minigameInfo: "PREGUNTAS: 5 | CATEGORÍAS: Tech, Historia, Ciencia",
  },
};
