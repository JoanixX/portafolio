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
                    <span id="quiz-lives" style="font-size: 1.2rem; color: #ef4444; text-shadow: 0 0 5px #ef4444;">❤️❤️❤️</span>
                    <span id="quiz-score" style="font-size: 1rem; color: #ffd43b; font-weight: bold;">0/5 Acertadas</span>
                    <span id="easter-plant" style="font-size: 1.5rem; cursor: pointer; user-select: none;" title="Un simple brote.">🌱</span>
                </div>
                
                <div id="quiz-category" style="font-size: 0.75rem; color: #aed581; margin-bottom: 10px; font-weight: bold; letter-spacing: 1px;">CATEGORÍA 1/5</div>
                <div id="quiz-text" style="font-size: 1.05rem; color: #fff; margin-bottom: 20px; line-height: 1.4; min-height: 3rem;">¿Pregunta?</div>
                
                <div id="quiz-options" style="display: flex; flex-direction: column; gap: 8px;">
                    <!-- Botones -->
                </div>
                
                <div id="quiz-feedback" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.5); font-size: 3rem; font-weight: bold; pointer-events: none; opacity: 0; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); z-index: 50;">
                </div>
            </div>
            
            <div class="game-controls">
                <div id="game-status" class="status-msg">Enfrenta el conocimiento. Pierde 3 vidas y Game Over.</div>
                <button id="play-game-btn" class="btn reward">JUGAR (75 Coins)</button>
            </div>
            <style>
                .quiz-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    color: #fff;
                    padding: 10px 15px;
                    border-radius: 8px;
                    text-align: left;
                    font-family: monospace;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .quiz-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: #ffd43b;
                }
                .quiz-btn.correct {
                    background: rgba(169, 227, 75, 0.2);
                    border-color: #a9e34b;
                    color: #a9e34b;
                }
                .quiz-btn.wrong {
                    background: rgba(239, 68, 68, 0.2);
                    border-color: #ef4444;
                    color: #ef4444;
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
                    this.applyGodMode();
                }
            });
        }
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

        const q = this.questions[this.currentQIndex];
        
        const catEl = this.container.querySelector('#quiz-category');
        if (catEl) catEl.textContent = `[${this.currentQIndex + 1}/5] ${q.category}`;
        
        const textEl = this.container.querySelector('#quiz-text');
        if (textEl) textEl.textContent = q.text;

        const optsContainer = this.container.querySelector('#quiz-options');
        if (!optsContainer) return;
        optsContainer.innerHTML = '';

        q.options.forEach((opt, index) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            btn.textContent = `${['A', 'B', 'C', 'D'][index]}) ${opt}`;
            btn.addEventListener('click', () => this.handleAnswer(index, btn));
            optsContainer.appendChild(btn);
        });

        if (this.godMode) {
            this.applyGodMode();
        }
    }

    private applyGodMode() {
        if (!this.gameActive) return;
        const q = this.questions[this.currentQIndex];
        const optsContainer = this.container.querySelector('#quiz-options');
        if (!optsContainer) return;
        
        const buttons = Array.from(optsContainer.children) as HTMLElement[];
        buttons.forEach((btn, index) => {
            if (index !== q.correctIndex && Math.random() > 0.3) {
                btn.classList.add('wrong-godmode');
            }
        });
    }

    private handleAnswer(index: number, btnStr: HTMLElement) {
        if (!this.gameActive) return;
        const q = this.questions[this.currentQIndex];
        const optsContainer = this.container.querySelector('#quiz-options');
        
        if (optsContainer) {
            const buttons = Array.from(optsContainer.children) as HTMLButtonElement[];
            buttons.forEach(b => b.disabled = true);
        }

        if (index === q.correctIndex) {
            this.correctCount++;
            btnStr.classList.add('correct');
            this.showFeedback("¡CORRECTO!", "#a9e34b");
        } else {
            this.lives--;
            btnStr.classList.add('wrong');
            
            if (optsContainer) {
                const buttons = Array.from(optsContainer.children) as HTMLButtonElement[];
                if (buttons[q.correctIndex]) {
                    buttons[q.correctIndex].classList.add('correct');
                }
            }
            this.showFeedback("ERROR", "#ef4444");
        }

        this.updateHUD();
        setTimeout(() => {
            this.currentQIndex++;
            this.renderQuestion();
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