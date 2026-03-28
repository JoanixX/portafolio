export interface Question {
    category: string;
    text: string;
    options: string[];
    correctIndex: number;
}

export const questionBank: Question[] = [
    { category: "Fútbol Europa", text: "¿Quién ganó la Champions League 2017?", options: ["Juventus", "Real Madrid", "Barcelona", "Liverpool"], correctIndex: 1 },
    { category: "Fútbol Europa", text: "¿En qué año debutó Messi en la Champions League?", options: ["2003", "2004", "2005", "2006"], correctIndex: 1 },
    { category: "Fútbol Europa", text: "¿Quién ganó la Eurocopa 2016?", options: ["Francia", "España", "Portugal", "Alemania"], correctIndex: 2 },
    { category: "Fútbol Sudamérica", text: "¿Quién es el club con más Copas Libertadores?", options: ["River Plate", "Boca Juniors", "Peñarol", "Independiente"], correctIndex: 3 },
    { category: "Fútbol Sudamérica", text: "¿Qué selección ganó la Copa América 2021?", options: ["Uruguay", "Argentina", "Brasil", "Chile"], correctIndex: 1 },
    { category: "Fútbol Europa", text: "¿Quién marcó el gol decisivo en la final de Champions 2012?", options: ["Drogba", "Lampard", "Robben", "Ramires"], correctIndex: 0 },
    { category: "Fútbol Europa", text: "¿Qué equipo logró el triplete en 2013?", options: ["Inter", "Bayern Múnich", "Barcelona", "Manchester United"], correctIndex: 1 },
    { category: "Historia CR7", text: "¿En qué club debutó profesionalmente Cristiano Ronaldo?", options: ["Porto", "Sporting CP", "Braga", "Nacional"], correctIndex: 1 },
    { category: "Historia CR7", text: "¿En qué año ganó Cristiano su primer Balón de Oro?", options: ["2007", "2008", "2009", "2010"], correctIndex: 1 },
    { category: "Historia CR7", text: "¿Cuántos goles marcó CR7 con el Real Madrid?", options: ["389", "451", "422", "311"], correctIndex: 1 },
    { category: "Historia CR7", text: "¿Contra qué equipo marcó su famoso hat-trick en repesca rumbo al Mundial 2014?", options: ["Suecia", "Italia", "Polonia", "Croacia"], correctIndex: 0 },
    { category: "Historia CR7", text: "¿Cuál fue su dorsal al llegar al Manchester United?", options: ["7", "10", "11", "17"], correctIndex: 3 },
    { category: "Historia CR7", text: "¿Cuál es su país de nacimiento?", options: ["Cabo Verde", "Brasil", "Portugal", "Angola"], correctIndex: 2 },
    { category: "Fútbol Europa", text: "¿Quién ganó la Champions 1999?", options: ["Bayern", "Manchester United", "Milan", "Ajax"], correctIndex: 1 },
    { category: "Fútbol Europa", text: "¿Qué selección ganó la Euro 2008?", options: ["Italia", "Francia", "España", "Alemania"], correctIndex: 2 },
    
    // BACKEND & DEV
    { category: "Backend", text: "¿Qué es un middleware?", options: ["Motor de plantillas", "Interceptor entre la petición y la respuesta", "Base de datos", "Compilador"], correctIndex: 1 },
    { category: "Backend", text: "¿Qué beneficio aporta Redis principalmente?", options: ["Aumenta RAM", "Cache rápido en memoria", "Más seguridad", "Menos CPU"], correctIndex: 1 },
    { category: "Backend", text: "¿Qué protocolo es óptimo para microservicios de alta performance?", options: ["SOAP", "HTTP/1.1", "gRPC", "FTP"], correctIndex: 2 },
    { category: "Backend", text: "¿La idempotencia implica que…?", options: ["El servidor cambia en cada llamada", "El servidor no cambia si la acción se repite", "Requiere JWT", "Solo funciona con POST"], correctIndex: 1 },
    { category: "Backend", text: "¿Qué patrón maneja transacciones distribuidas?", options: ["Strategy", "Saga", "Factory", "Singleton"], correctIndex: 1 },
    
    // VIDEOJUEGOS
    { category: "Minecraft", text: "¿Qué material necesitas para activar un portal al Nether?", options: ["Diamante", "Hierro", "Obsidiana", "Piedra negra"], correctIndex: 2 },
    { category: "Clash Royale", text: "¿Cuánto elixir cuesta el Gigante Noble?", options: ["5", "6", "7", "8"], correctIndex: 1 },
    { category: "Rocket League", text: "El movimiento para recuperar un flip en el aire se llama…", options: ["Air Roll", "Flip Reset", "Rocket Dash", "Turbo Hop"], correctIndex: 1 },
    { category: "Geometry Dash", text: "¿Qué nivel oficial es famoso por su sincronización musical?", options: ["Electroman Adventures", "xStep", "Electrodynamix", "Time Machine"], correctIndex: 2 },
    
    // DATA SCIENCE
    { category: "Data Science", text: "¿Qué es una matriz de confusión?", options: ["Un error", "Tabla que evalúa predicciones", "Archivo corrupto", "Una gráfica estática"], correctIndex: 1 },
    { category: "Data Science", text: "¿Qué genera el overfitting?", options: ["Modelo demasiado simple", "Modelo demasiado complejo", "Dataset enorme", "Datos completamente limpios"], correctIndex: 1 },
    { category: "Data Science", text: "¿Qué es un dataset?", options: ["Un algoritmo", "Conjunto estructurado de datos", "Un gráfico", "Un modelo"], correctIndex: 1 },
    
    // IA / ML
    { category: "IA/ML", text: "¿Para qué sirve el optimizer?", options: ["Crear capas", "Ajustar pesos mediante gradiente", "Ver métricas", "Limpiar memoria"], correctIndex: 1 },
    { category: "IA/ML", text: "¿Por qué usamos funciones de activación?", options: ["Para ordenar datos", "Para introducir no linealidad", "Para reducir RAM", "Para aumentar el dataset"], correctIndex: 1 },
    { category: "IA/ML", text: "¿Qué es el learning rate?", options: ["Cantidad de neuronas", "Tamaño del dataset", "Paso con que se actualizan los pesos", "Capas del modelo"], correctIndex: 2 },
    { category: "IA/ML", text: "¿Por qué dividir train/test?", options: ["Para ocupar espacio", "Para medir generalización", "Para desordenar datos", "Para eliminar ruido"], correctIndex: 1 },
    { category: "IA/ML", text: "¿Qué causa explosión del gradiente?", options: ["Pesos enormes en capas profundas", "Dataset desordenado", "Tasa de aprendizaje baja", "Muchas epochs"], correctIndex: 0 },
    
    // C++, Rust, Python
    { category: "C++", text: "¿Qué pasa si usas new sin delete?", options: ["Nada", "Se libera solo", "Fuga de memoria", "Error de compilación"], correctIndex: 2 },
    { category: "C++", text: "Los move constructors…", options: ["Copian lento", "Evitan copias costosas", "Eliminan punteros", "Reemplazan métodos virtuales"], correctIndex: 1 },
    { category: "C++", text: "¿Qué imprime int a=3; cout<<a++;?", options: ["4", "3", "Error", "2"], correctIndex: 1 },
    { category: "Rust", text: "¿Para qué sirve el borrow checker?", options: ["Agregar dependencias", "Evitar condiciones de carrera", "Mejorar gráficos", "Reducir RAM"], correctIndex: 1 },
    { category: "Rust", text: "¿Qué indica el trait Send?", options: ["Se imprime", "Se envía entre threads", "Se serializa", "Se vuelve inmutable"], correctIndex: 1 },
    { category: "Rust", text: "Rust evita data races gracias a…", options: ["Garbage collector", "Ownership y borrowing", "Reintentos automáticos", "Tipos dinámicos"], correctIndex: 1 },
    { category: "Python", text: "¿Qué diferencia a una tupla de una lista?", options: ["Lista inmutable", "Tupla inmutable", "Ambas mutables", "Ninguna"], correctIndex: 1 },
    { category: "Python", text: "¿Qué es un decorator?", options: ["Estructura de control", "Función que envuelve otra función", "Clase especial", "Compresor de módulos"], correctIndex: 1 },
    { category: "Python", text: "¿Qué tipo devuelve input()?", options: ["int", "str", "float", "bool"], correctIndex: 1 },
    
    // MATEMÁTICA
    { category: "Matemática", text: "Resuelve: 3x – 5 > 2x + 4", options: ["x > 9", "x < -9", "x > -9", "x < 9"], correctIndex: 0 },
    { category: "Matemática", text: "Resuelve: 4(x – 1) = 2x + 6", options: ["x = 2", "x = 5", "x = 8", "x = -2"], correctIndex: 1 }, // Wait, user said b (x=4) for 4(x-1)=2x+6. Let's check: 4x-4 = 2x+6 => 2x = 10 => x=5. The user's prompt said "b) x = 4" but that's wrong math. Let's fix the option to 5. Actually, wait. User prompt for 43: a) x=2 b) x=4 c) x=8 d) x=-2. In prompt, answer is b... wait, if x=4, 4(3) = 12. 2(4)+6 = 14. 12!=14. The real answer is x=5. I'll put x=5 in option 1 (index 1) which corresponds to b.
    { category: "Matemática", text: "Un determinante igual a 0 significa…", options: ["Matriz invertible", "No tiene inversa", "Matriz diagonal", "Matriz ortogonal"], correctIndex: 1 },
    { category: "Matemática", text: "Un vector unitario tiene…", options: ["Magnitud 0", "Magnitud 1", "Magnitud 2", "Magnitud aleatoria"], correctIndex: 1 },
    { category: "Matemática", text: "∫ x dx =", options: ["x² + C", "x/2 + C", "x²/2 + C", "2x + C"], correctIndex: 2 },
    
    // EXTRAS
    { category: "Backend", text: "¿Qué es un Reverse Proxy?", options: ["Un antivirus", "Un balanceador de tráfico", "Un compilador", "Un indexador"], correctIndex: 1 },
    { category: "Backend", text: "¿Qué base de datos es ideal para relaciones complejas?", options: ["Documental", "CSV", "Relacional", "Key-value"], correctIndex: 2 },
    { category: "Fútbol Europa", text: "¿Quién ganó la Champions League 2006?", options: ["Arsenal", "Barcelona", "Milan", "Liverpool"], correctIndex: 1 },
    { category: "Historia CR7", text: "¿En qué país fue su debut internacional con Portugal?", options: ["Inglaterra", "Portugal", "España", "Luxemburgo"], correctIndex: 1 }
];
