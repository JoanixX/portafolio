import { questionBank, type Question } from '../data/questions';

export class QuizGame {
    private apiUrl: string;
    private container: HTMLElement;
    private gameActive: boolean = false;
    private questions: Question[] = [];
    private currentQIndex: number = 0;
    private correctCount: number = 0;
    private lives: number = 3;
    
    private clickEasterEgg: number = 0;
    private godMode: boolean = false;
    private optionPage: number = 0;
    private questionAnswered: boolean = false;
    private selectedAnswerIndex: number = -1;

    constructor(apiUrl: string, container: HTMLElement) {
        this.apiUrl = apiUrl;
        this.container = container;
    }

    private getUserId(): String {
        let id = localStorage.getItem('portfolio_user_id');
        if (!id) {
            id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem('portfolio_user_id', id);
        }
        return id;
    }

    public init() {
        if (!this.container) return;
        this.cleanup();

        this.container.innerHTML = `
            <div id="quiz-ui" style="width: 100%; height: 100%; font-family: monospace; display: none; flex-direction: column; padding: 20px; box-sizing: border-box; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <span id="quiz-lives" style="font-size: 1.2rem; color: #ef4444; font-weight: 800; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">❤️❤️❤️</span>
                    <span id="quiz-score" style="font-size: 1rem; color: #ffd43b; font-weight: 800; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">0/5 Acertadas</span>
                    <span id="easter-plant" style="font-size: 1.5rem; cursor: pointer; user-select: none; font-weight: 800; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);" title="Un simple brote.">🌱</span>
                </div>
                
                <div id="quiz-category" style="font-size: 0.6rem; color: #aed581; margin-bottom: 5px; margin-left: 20px; font-weight: 800; letter-spacing: 1px; text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">CATEGORÍA 1/5</div>
                <div id="quiz-text" style="font-size: 0.8rem; color: #ffffff; font-weight: 800; text-shadow: 1px 1px 4px #000, 0 0 10px rgba(0,0,0,0.8); margin-top: 25px; margin-bottom: 15px; margin-left: 20px; line-height: 1.4; min-height: 2.5rem;">¿Pregunta?</div>
                
                <div style="flex-grow: 0.6; display: flex; justify-content: flex-end; align-items: flex-end; transform: translateX(15px);">
                  <div style="display: flex; align-items: center; gap: 8px;">
                      <button id="quiz-prev-btn" class="nav-btn">◀</button>
                      <div id="quiz-options-container" style="display: flex; flex-direction: column; gap: 8px; width: 170px;">
                          <!-- Botones en paginas de a 2 -->
                      </div>
                      <button id="quiz-next-btn" class="nav-btn">▶</button>
                  </div>
                </div>
                
                <div id="quiz-feedback" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5); font-size: 3rem; font-weight: bold; pointer-events: none; opacity: 0; text-shadow: 2px 2px 10px #000; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 50;">
                </div>
            </div>
            
            <div class="game-controls">
                <div id="game-status" class="status-msg">Enfrenta el conocimiento. Pierde 3 vidas y Game Over.</div>
                <button id="play-game-btn" class="btn reward">JUGAR (75 Coins)</button>
            </div>
            <style>
                .nav-btn {
                    background: #222;
                    border: 2px solid #555;
                    color: white;
                    padding: 10px 5px;
                    width: 25px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: 800;
                    transition: 0.2s;
                }
                .nav-btn:hover:not(:disabled) {
                    background: #444;
                    border-color: #ffd43b;
                }
                .nav-btn:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                .quiz-btn {
                    background: #1e1e24;
                    border: 2px solid #555;
                    color: #fff;
                    padding: 8px;
                    border-radius: 8px;
                    text-align: center;
                    font-family: monospace;
                    font-size: 0.75rem;
                    font-weight: 800;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.5);
                    width: 100%;
                }
                .quiz-btn:hover:not(:disabled) {
                    background: #333;
                    border-color: #ffd43b;
                    transform: translateY(-2px);
                }
                .quiz-btn:disabled {
                    cursor: default;
                }
                .quiz-btn.correct {
                    background: #2b8a3e !important;
                    border-color: #a9e34b !important;
                    color: #fff !important;
                }
                .quiz-btn.wrong {
                    background: #c92a2a !important;
                    border-color: #ffc9c9 !important;
                    color: #fff !important;
                }
                .quiz-btn.wrong-godmode {
                    animation: glitch 1s infinite alternate;
                    opacity: 0.3;
                    pointer-events: none;
                }
                @keyframes glitch {
                    from { transform: translateX(-2px); filter: hue-rotate(90deg); }
                    to { transform: translateX(2px); filter: hue-rotate(-90deg); }
                }
            </style>
        `;

        const btn = this.container.querySelector('#play-game-btn');
        if (btn) btn.addEventListener('click', () => this.tryStartGame());

        const plant = this.container.querySelector('#easter-plant');
        if (plant) {
            plant.addEventListener('click', () => {
                this.clickEasterEgg++;
                if (this.clickEasterEgg === 5 && !this.godMode && this.gameActive) {
                    this.godMode = true;
                    plant.textContent = '🍄';
                    (plant as HTMLElement).title = "Modo Dios: Las repuestas incorrectas fallan.";
                    this.showFeedback("MODO DIOS", "#a9e34b");
                    this.renderOptionsPage();
                }
            });
        }

        const prevBtn = this.container.querySelector('#quiz-prev-btn');
        if(prevBtn) prevBtn.addEventListener('click', () => this.changePage(-1));
        const nextBtn = this.container.querySelector('#quiz-next-btn');
        if(nextBtn) nextBtn.addEventListener('click', () => this.changePage(1));
    }

    private async tryStartGame() {
        const userId = this.getUserId();
        const statusEl = this.container.querySelector('#game-status') as HTMLElement;
        try {
            const res = await fetch(`${this.apiUrl}/play_game`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-User-ID': userId.toString()
                },
                body: JSON.stringify({ cost: 75 })
            });

            if (res.ok) {
                document.dispatchEvent(new Event('coin-collected')); 
                const controls = this.container.querySelector('.game-controls');
                if (controls) controls.classList.add('hidden');
                
                this.start();
            } else {
                const err = await res.json();
                if (statusEl) statusEl.innerText = "Error: " + (err.error || "Fondos insuficientes");
            }
        } catch(e) { console.error(e); }
    }

    private start() {
        this.gameActive = true;
        this.lives = 3;
        this.correctCount = 0;
        this.currentQIndex = 0;
        this.clickEasterEgg = 0;
        this.godMode = false;
        this.optionPage = 0;
        this.questionAnswered = false;
        this.selectedAnswerIndex = -1;

        const plant = this.container.querySelector('#easter-plant') as HTMLElement;
        if(plant) { plant.textContent = '🌱'; plant.title = "Un simple brote."; }

        // Seleccionar 5 preguntas random
        const shuffled = [...questionBank].sort(() => 0.5 - Math.random());
        this.questions = shuffled.slice(0, 5);

        const quizUi = this.container.querySelector('#quiz-ui') as HTMLElement;
        if (quizUi) {
            quizUi.style.display = 'flex';
        }

        this.updateHUD();
        this.renderQuestion();
    }

    private updateHUD() {
        const livesEl = this.container.querySelector('#quiz-lives');
        if (livesEl) {
            livesEl.textContent = '❤️'.repeat(this.lives) + '🖤'.repeat(3 - this.lives);
        }
        const scoreEl = this.container.querySelector('#quiz-score');
        if (scoreEl) {
            scoreEl.textContent = `${this.correctCount}/5 Acertadas`;
        }
    }

    private renderQuestion() {
        if (this.currentQIndex >= 5 || this.lives <= 0) {
            this.endGame();
            return;
        }

        this.optionPage = 0;
        this.questionAnswered = false;
        this.selectedAnswerIndex = -1;

        const q = this.questions[this.currentQIndex];
        
        const catEl = this.container.querySelector('#quiz-category');
        if (catEl) catEl.textContent = `[${this.currentQIndex + 1}/5] ${q.category}`;
        
        const textEl = this.container.querySelector('#quiz-text');
        if (textEl) textEl.textContent = q.text;

        this.renderOptionsPage();
    }

    private changePage(dir: number) {
        if (!this.gameActive) return;
        let newPage = this.optionPage + dir;
        if (newPage >= 0 && newPage <= 1) { // 2 Pages: 0 or 1
            this.optionPage = newPage;
            this.renderOptionsPage();
        }
    }

    private renderOptionsPage() {
        const q = this.questions[this.currentQIndex];
        const optsContainer = this.container.querySelector('#quiz-options-container');
        if (!optsContainer) return;
        optsContainer.innerHTML = '';

        const start = this.optionPage * 2;
        const end = start + 2;

        q.options.slice(start, end).forEach((opt, index) => {
            const actualIndex = start + index;
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            btn.textContent = `${['A', 'B', 'C', 'D'][actualIndex]}) ${opt}`;
            
            if (this.questionAnswered) {
                btn.disabled = true;
                if (actualIndex === q.correctIndex) btn.classList.add('correct');
                else if (this.selectedAnswerIndex === actualIndex) btn.classList.add('wrong');
            } else {
                btn.addEventListener('click', () => this.handleAnswer(actualIndex, btn));
                if (this.godMode && actualIndex !== q.correctIndex && Math.random() > 0.3) {
                    btn.classList.add('wrong-godmode');
                }
            }
            optsContainer.appendChild(btn);
        });

        const prevBtn = this.container.querySelector('#quiz-prev-btn') as HTMLButtonElement;
        const nextBtn = this.container.querySelector('#quiz-next-btn') as HTMLButtonElement;
        if (prevBtn) prevBtn.disabled = this.optionPage === 0;
        if (nextBtn) nextBtn.disabled = this.optionPage === 1;
    }

    private handleAnswer(index: number, btnStr: HTMLElement) {
        if (!this.gameActive || this.questionAnswered) return;
        
        this.questionAnswered = true;
        this.selectedAnswerIndex = index;
        
        const q = this.questions[this.currentQIndex];
        
        if (index === q.correctIndex) {
            this.correctCount++;
            this.showFeedback("¡CORRECTO!", "#a9e34b");
        } else {
            this.lives--;
            this.showFeedback("ERROR", "#ef4444");
        }

        // Re-render specifically to apply correct/wrong classes on visible buttons 
        // and disable any interactions immediately.
        this.renderOptionsPage();

        this.updateHUD();
        setTimeout(() => {
            if(this.gameActive) {
                this.currentQIndex++;
                this.renderQuestion();
            }
        }, 1500);
    }

    private showFeedback(text: string, color: string) {
        const fb = this.container.querySelector('#quiz-feedback') as HTMLElement;
        if (!fb) return;
        fb.textContent = text;
        fb.style.color = color;
        fb.style.opacity = '1';
        fb.style.transform = 'translate(-50%, -50%) scale(1)';
        
        setTimeout(() => {
            fb.style.opacity = '0';
            fb.style.transform = 'translate(-50%, -50%) scale(0.5)';
        }, 1000);
    }

    private async endGame() {
        this.gameActive = false;
        const quizUi = this.container.querySelector('#quiz-ui') as HTMLElement;
        if (quizUi) quizUi.style.display = 'none';

        const controls = this.container.querySelector('.game-controls');
        if (controls) controls.classList.remove('hidden');

        const btn = this.container.querySelector('#play-game-btn') as HTMLButtonElement | null;
        if (btn) btn.innerText = "JUGAR DE NUEVO (75 Coins)";

        const status = this.container.querySelector('#game-status') as HTMLElement;
        let coinsWon = this.correctCount * 30;
        let bonus = 0;
        let msg = "";

        if (this.lives <= 0) {
            msg = `Te quedaste sin vidas... Conseguiste ${this.correctCount}/5 aciertos.`;
        } else if (this.correctCount === 5) {
            bonus = 50;
            msg = `¡PERFECTO! Full-Stack Master. (Bono +50)`;
        } else {
            msg = `Juego terminado. ${this.correctCount}/5 aciertos. ¡Buena suerte a la próxima!`;
        }
        
        const totalCoins = coinsWon + bonus;

        if (totalCoins > 0) {
            try {
                const userId = this.getUserId();
                await fetch(`${this.apiUrl}/reward_coins`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-User-ID': userId.toString()
                    },
                    body: JSON.stringify({ amount: totalCoins, reward_id: null }) 
                });
                document.dispatchEvent(new Event('coin-collected'));
                if(status) status.innerText = `${msg} Ganaste ${totalCoins} monedas.`;
            } catch(e) { console.error(e); }
        } else {
            if(status) status.innerText = `${msg} No ganaste nada.`;
        }
    }

    public cleanup() {
        this.gameActive = false;
    }
}