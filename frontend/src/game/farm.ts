export class FarmGame {
    private apiUrl: string;
    private container: HTMLElement;
    private gameActive: boolean = false;
    private score: number = 0;
    private timeLeft: number = 40;
    private gameInterval: number | null = null;
    private spawnInterval: number | null = null;
    private clickCount: number = 0;

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
            <div id="farm-ui" style="width: 100%; height: 100%; position: relative; display: none; flex-direction: column; overflow: hidden; background: transparent; border-radius: 12px; cursor: crosshair;">
                <!-- HUD -->
                <div style="position: absolute; top: 20px; left: 25px; z-index: 10; font-family: monospace; font-size: 1rem; font-weight: 800; color: #fff; text-shadow: 2px 2px 4px #000;">
                    TIEMPO: <span id="farm-timer" style="color: #ef4444;">40</span>s
                </div>
                <div style="position: absolute; top: 20px; right: 25px; z-index: 10; font-family: monospace; font-size: 1rem; font-weight: 800; color: #ffd43b; text-shadow: 2px 2px 4px #000;">
                    COINS: <span id="farm-score">0</span>
                </div>
                <div id="farm-easter" style="position: absolute; top: 45px; right: 25px; z-index: 10; font-size: 1.2rem; cursor: pointer; filter: drop-shadow(1px 1px 2px #000);" title="Nido vacío">🪹</div>
                
                <!-- PLAY AREA -->
                <div id="farm-play-area" style="width: 100%; height: 100%; position: relative; pointer-events: auto;">
                    <!-- Animals will spawn here -->
                </div>
                
                <div id="farm-feedback" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 3rem; font-weight: 900; color: #fff; text-shadow: 2px 2px 10px #000; pointer-events: none; opacity: 0; transition: all 0.3s; z-index: 50;">
                </div>
            </div>
            
            <div class="game-controls">
                <div id="game-status" class="status-msg">Dispara huevos (click) a los pollos (🐥 +10). Evita Cerdos (🐷 -20) y Vacas (🐮 -50).</div>
                <button id="play-game-btn" class="btn reward">INICIAR (75 Coins)</button>
            </div>
            
            <style>
                .farm-entity {
                    position: absolute;
                    font-size: 1.8rem;
                    user-select: none;
                    cursor: crosshair;
                    transition: transform 0.1s;
                    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.5));
                    z-index: 5;
                }
                .farm-entity:active {
                    transform: scale(0.8);
                }
                .egg-splat {
                    position: absolute;
                    font-size: 1.5rem;
                    pointer-events: none;
                    animation: splat 0.5s ease-out forwards;
                    z-index: 20;
                }
                .float-text {
                    position: absolute;
                    font-family: monospace;
                    font-weight: 900;
                    font-size: 1.2rem;
                    pointer-events: none;
                    animation: floatUp 0.8s ease-out forwards;
                    z-index: 25;
                    text-shadow: 1px 1px 3px #000;
                }
                @keyframes splat {
                    0% { transform: scale(0); opacity: 1; }
                    50% { transform: scale(1.5); opacity: 1; }
                    100% { transform: scale(2); opacity: 0; }
                }
                @keyframes floatUp {
                    0% { transform: translateY(0) scale(1); opacity: 1; }
                    100% { transform: translateY(-30px) scale(1.2); opacity: 0; }
                }
            </style>
        `;

        const btn = this.container.querySelector('#play-game-btn');
        if (btn) btn.addEventListener('click', () => this.tryStartGame());

        const playArea = this.container.querySelector('#farm-play-area');
        if(playArea) {
            playArea.addEventListener('mousedown', (e) => this.shootEgg(e as MouseEvent));
        }

        const nest = this.container.querySelector('#farm-easter');
        if (nest) {
            nest.addEventListener('click', (e) => {
                e.stopPropagation();
                this.clickCount++;
                if (this.clickCount === 7 && this.gameActive) {
                    nest.textContent = '🥚✨';
                    (nest as HTMLElement).title = "Huevo Dorado de Granjero Dios";
                    this.score += 100;
                    this.updateHUD();
                    this.showFloatText("¡HUEVO DORADO SECRETO! +100", (e as MouseEvent).clientX - this.container.getBoundingClientRect().left, 50, "#ffd43b");
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
        this.score = 0;
        this.timeLeft = 40;
        this.clickCount = 0;

        const nest = this.container.querySelector('#farm-easter') as HTMLElement;
        if(nest) { nest.textContent = '🪹'; nest.title = "Nido vacío"; }

        const farmUi = this.container.querySelector('#farm-ui') as HTMLElement;
        if (farmUi) farmUi.style.display = 'flex';

        const playArea = this.container.querySelector('#farm-play-area') as HTMLElement;
        if (playArea) playArea.innerHTML = '';

        this.updateHUD();

        this.gameInterval = window.setInterval(() => {
            this.timeLeft--;
            this.updateHUD();
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        this.spawnInterval = window.setInterval(() => {
            if (this.gameActive) this.spawnEntity();
        }, 800);
    }

    private updateHUD() {
        const timerEl = this.container.querySelector('#farm-timer') as HTMLElement;
        if (timerEl) {
            timerEl.textContent = this.timeLeft.toString();
            if(this.timeLeft <= 10) timerEl.style.color = "#c92a2a";
            else timerEl.style.color = "#ef4444";
        }
        const scoreEl = this.container.querySelector('#farm-score') as HTMLElement;
        if (scoreEl) scoreEl.textContent = this.score.toString();
    }

    private shootEgg(e: MouseEvent) {
        if (!this.gameActive) return;
        
        const playArea = this.container.querySelector('#farm-play-area') as HTMLElement;
        if(!playArea) return;

        const rect = playArea.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const splat = document.createElement('div');
        splat.textContent = '🍳';
        splat.className = 'egg-splat';
        splat.style.left = `${x - 16}px`;
        splat.style.top = `${y - 16}px`;
        playArea.appendChild(splat);

        setTimeout(() => splat.remove(), 500);

        const entities = Array.from(playArea.querySelectorAll('.farm-entity')) as HTMLElement[];
        for (let i = entities.length - 1; i >= 0; i--) {
            const ent = entities[i];
            const entRect = ent.getBoundingClientRect();
            if (e.clientX >= entRect.left && e.clientX <= entRect.right &&
                e.clientY >= entRect.top && e.clientY <= entRect.bottom) {
                this.handleHit(ent, x, y);
                break;
            }
        }
    }

    private handleHit(entity: HTMLElement, x: number, y: number) {
        const type = entity.dataset.type;
        entity.remove();

        if (type === 'chicken') {
            this.score += 10;
            this.showFloatText("+10", x, y, "#a9e34b");
        } else if (type === 'pig') {
            this.score -= 20;
            this.showFloatText("-20", x, y, "#ffc9c9");
        } else if (type === 'cow') {
            this.score -= 50;
            this.showFloatText("-50", x, y, "#c92a2a");
        } else if (type === 'fox') {
            this.score += 50;
            this.showFloatText("¡ZORRO CAZADO! +50", x, y, "#ffd43b");
        }

        this.updateHUD();
    }

    private showFloatText(text: string, x: number, y: number, color: string) {
        const playArea = this.container.querySelector('#farm-play-area');
        if(!playArea) return;

        const floatEl = document.createElement('div');
        floatEl.className = 'float-text';
        floatEl.textContent = text;
        floatEl.style.color = color;
        floatEl.style.left = `${x}px`;
        floatEl.style.top = `${y - 20}px`;
        playArea.appendChild(floatEl);

        setTimeout(() => floatEl.remove(), 800);
    }

    private spawnEntity() {
        const playArea = this.container.querySelector('#farm-play-area');
        if (!playArea) return;

        const types = [
            { type: 'chicken', emoji: '🐥', speed: 1800, chance: 0.45 },
            { type: 'pig', emoji: '🐷', speed: 4500, chance: 0.35 },
            { type: 'cow', emoji: '🐮', speed: 6000, chance: 0.17 },
            { type: 'fox', emoji: '🦊', speed: 1200, chance: 0.03 }
        ];

        let rand = Math.random();
        let selected = types[0];
        let cumulative = 0;
        for (const t of types) {
            cumulative += t.chance;
            if (rand <= cumulative) {
                selected = t;
                break;
            }
        }

        const entity = document.createElement('div');
        entity.className = 'farm-entity';
        entity.dataset.type = selected.type;
        entity.textContent = selected.emoji;

        const pathPoints = [
            { x: 15, y: -10 },
            { x: 45, y: 110 },
            { x: 110, y: 55 },
            { x: -10, y: 75 }
        ];

        const startIdx = Math.floor(Math.random() * pathPoints.length);
        let endIdx = Math.floor(Math.random() * pathPoints.length);
        while (endIdx === startIdx) endIdx = Math.floor(Math.random() * pathPoints.length);

        const start = pathPoints[startIdx];
        const end = pathPoints[endIdx];

        const areaWidth = (playArea as HTMLElement).clientWidth;
        const areaHeight = (playArea as HTMLElement).clientHeight;

        let curX = (start.x / 100) * areaWidth;
        let curY = (start.y / 100) * areaHeight;
        let targetX = (end.x / 100) * areaWidth;
        let targetY = (end.y / 100) * areaHeight;

        const duration = selected.speed / 1000;
        const fps = 60;
        const totalFrames = duration * fps;
        let vx = (targetX - curX) / totalFrames;
        let vy = (targetY - curY) / totalFrames;
        entity.style.left = `${curX}px`;
        entity.style.top = `${curY}px`;
        if (vx < 0) entity.style.transform = 'scaleX(-1)';
        playArea.appendChild(entity);

        const hitboxes = [
            { xMin: 0.60, xMax: 0.95, yMin: 0.05, yMax: 0.30 },
            { xMin: -0.05, xMax: 0.35, yMin: 0.30, yMax: 0.60 },
            { xMin: 0.75, xMax: 1.05, yMin: 0.70, yMax: 0.95 }
        ];

        let frame = 0;
        const moveInterval = window.setInterval(() => {
            if (!this.gameActive) {
                clearInterval(moveInterval);
                entity.remove();
                return;
            }
            curX += vx;
            curY += vy;

            const pX = curX / areaWidth;
            const pY = curY / areaHeight;

            for (const box of hitboxes) {
                if (pX >= box.xMin && pX <= box.xMax && pY >= box.yMin && pY <= box.yMax) {
                    const fromTop = Math.abs(pY - box.yMin);
                    const fromBottom = Math.abs(pY - box.yMax);
                    const fromLeft = Math.abs(pX - box.xMin);
                    const fromRight = Math.abs(pX - box.xMax);
                    
                    if (Math.min(fromTop, fromBottom) < Math.min(fromLeft, fromRight)) {
                        vy = -vy;
                    } else {
                        vx = -vx;
                        entity.style.transform = vx < 0 ? 'scaleX(-1)' : 'scaleX(1)';
                    }
                    
                    curX += vx * 2;
                    curY += vy * 2;
                    break;
                }
            }

            entity.style.left = `${curX}px`;
            entity.style.top = `${curY}px`;

            frame++;
            if (curX < -50 || curX > areaWidth + 50 || curY < -50 || curY > areaHeight + 50) {
                clearInterval(moveInterval);
                entity.remove();
            }
            
            if (frame > totalFrames * 2) {
                clearInterval(moveInterval);
                entity.remove();
            }
        }, 1000 / fps);
    }

    private async endGame() {
        this.gameActive = false;
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.spawnInterval) clearInterval(this.spawnInterval);

        const farmUi = this.container.querySelector('#farm-ui') as HTMLElement;
        if (farmUi) farmUi.style.display = 'none';

        const controls = this.container.querySelector('.game-controls');
        if (controls) controls.classList.remove('hidden');

        const btn = this.container.querySelector('#play-game-btn') as HTMLButtonElement | null;
        if (btn) btn.innerText = "JUGAR DE NUEVO (75 Coins)";

        const status = this.container.querySelector('#game-status') as HTMLElement;
        
        let finalCoins = Math.max(0, this.score);
        if (finalCoins > 250) finalCoins = 250;

        let msg = "";
        if (finalCoins >= 150) {
            msg = `¡Impresionante granjero! Lograste ${this.score} puntos.`;
        } else if (finalCoins > 0) {
            msg = `Bien hecho, tiempo agotado. Lograste ${this.score} puntos.`;
        } else {
            msg = `¡Desastre en la granja! Tu puntuación fue ${this.score}.`;
        }

        if (finalCoins > 0) {
            try {
                const userId = this.getUserId();
                await fetch(`${this.apiUrl}/reward_coins`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-User-ID': userId.toString()
                    },
                    body: JSON.stringify({ amount: finalCoins, reward_id: null }) 
                });
                document.dispatchEvent(new Event('coin-collected'));
                if(status) status.innerText = `${msg} Ganaste ${finalCoins} monedas.`;
            } catch(e) { console.error(e); }
        } else {
            if(status) status.innerText = `${msg} No ganaste ninguna moneda.`;
        }
    }

    public cleanup() {
        this.gameActive = false;
        if (this.gameInterval) clearInterval(this.gameInterval);
        if (this.spawnInterval) clearInterval(this.spawnInterval);
    }
}