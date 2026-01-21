export class FishingGame {
    private apiUrl: string;
    private container: HTMLElement;
    
    private gameLoopId: number = 0;
    private score = 0;
    private timeLeft = 60;
    private hookState: 'idle' | 'dropping' | 'waiting' | 'reeling' = 'idle';
    private hookY = 50;
    private caughtEntity: any = null;
    private entities: any[] = [];
    private frameCount = 0;

    private readonly FISH_SPEED = 2;
    private readonly HOOK_SPEED = 5;
    private readonly SPAWN_RATE = 60;

    private currentSkin: number = 0;
    private boundHandleKey: (e: KeyboardEvent) => void;

    constructor(apiUrl: string, container: HTMLElement) {
        this.apiUrl = apiUrl;
        this.container = container;
        this.boundHandleKey = this.handleFishKey.bind(this);
    }

    public setSkin(skinIdx: number) {
        this.currentSkin = skinIdx;
    }

    // Initialize the visuals and controls
    public init() {
        if (!this.container) return;
        this.cleanup(); 

        // calcular skin
        const col = this.currentSkin % 5;
        const row = Math.floor(this.currentSkin / 5);
        const xPos = col * 25;
        const yPos = row * 100;

        // renderizar mundo
        this.container.innerHTML = `
            <div class="score-board">Score: <span id="f-score">0</span> | Time: <span id="f-time">60</span></div>
            <div id="hook-line" class="hook-line"></div>
            <div id="hook" class="hook">⚓</div>
            <div class="fisherman-container">
                <div class="char-sprite" style="background-position: ${xPos}% ${yPos}%"></div>
                <div class="fisherman-static">🎣</div>
            </div>
            <div id="entities-container"></div>
            
            <div class="game-controls">
                <div id="game-status" class="status-msg">Presiona JUGAR para comenzar</div>
                <div id="game-score" class="score-display"></div>
                <button id="play-game-btn" class="btn reward">JUGAR (75 Coins)</button>
            </div>
        `;
        
        // posicion anzuelo
        this.hookY = 50;
        this.renderHook();

        // boton jugar
        const btn = this.container.querySelector('#play-game-btn');
        if (btn) btn.addEventListener('click', () => this.tryStartGame());
    }

    private async tryStartGame() {
        const statusEl = this.container.querySelector('#game-status') as HTMLElement;
        try {
            const res = await fetch(`${this.apiUrl}/play_game`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cost: 75 })
            });

            if (res.ok) {
                document.dispatchEvent(new Event('coin-collected')); 
                
                // ocultar controles
                const controls = this.container.querySelector('.game-controls');
                if (controls) controls.classList.add('hidden');

                if (statusEl) statusEl.innerText = "¡A pescar! (Usa ESPACIO)";
                this.start();
            } else {
                const err = await res.json();
                if (statusEl) statusEl.innerText = "Error: " + (err.error || "Fondos insuficientes");
            }
        } catch(e) { console.error(e); }
    }

    private start() {
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
        document.removeEventListener('keydown', this.boundHandleKey);

        // reiniciar estado
        this.score = 0;
        this.timeLeft = 60;
        this.hookState = 'idle';
        this.hookY = 50;
        this.entities = [];
        this.caughtEntity = null;
        this.frameCount = 0;

        // limpiar entidades
        const entCont = this.container.querySelector('#entities-container');
        if (entCont) entCont.innerHTML = '';
        
        // iniciar loop
        document.addEventListener('keydown', this.boundHandleKey);
        this.gameLoopId = requestAnimationFrame(() => this.loop());
    }

    public cleanup() {
        if (this.gameLoopId) cancelAnimationFrame(this.gameLoopId);
        document.removeEventListener('keydown', this.boundHandleKey);
        this.entities = [];
    }

    private loop() {
        if (!document.body.contains(this.container)) return; 
        
        this.frameCount++;

        // 1. temporizador
        if (this.hookState !== 'waiting' && this.frameCount % 60 === 0) {
            this.timeLeft--;
            const tEl = this.container.querySelector('#f-time');
            if (tEl) tEl.textContent = this.timeLeft.toString();
        }

        if (this.timeLeft <= 0) {
            this.end(this.score > 0 ? "Tiempo agotado." : "Tiempo agotado sin puntos.");
            return;
        }

        // 2. aparicion
        if (this.hookState === 'idle' && this.frameCount % this.SPAWN_RATE === 0) {
            this.spawnEntity();
        }

        // 3. logica
        this.updateHook();
        if (this.hookState === 'idle') {
            this.updateEntities();
        }

        // 4. renderizado
        this.renderEntities();
        this.renderHook();

        // 5. ganar perder
        if (this.score >= 150) {
            this.end("¡Límite de ganancias alcanzado! (150)");
            return;
        }
        if (this.score < 0) {
            this.end("¡Puntos negativos! Game Over.");
            return;
        }

        this.gameLoopId = requestAnimationFrame(() => this.loop());
    }

    private handleFishKey(e: KeyboardEvent) {
        if (e.code === 'Space') {
            e.preventDefault();
            const statusEl = this.container.querySelector('#game-status') as HTMLElement;
            
            if (this.hookState === 'idle') {
                this.hookState = 'dropping';
            } else if (this.hookState === 'waiting') {
                this.hookState = 'reeling';
                if (statusEl) statusEl.innerText = "¡Subiendo!";
            }
        }
    }

    private spawnEntity() {
        const types = [
            { id: 'fish1', val: 15, icon: '🐟', yRange: [130, 320] },
            { id: 'fish2', val: 25, icon: '🐠', yRange: [150, 330] },
            { id: 'fish3', val: 35, icon: '🐡', yRange: [180, 340] },
            { id: 'can', val: -15, icon: '🥫', yRange: [130, 320] }
        ];
        
        const rand = Math.random();
        let type = types[0];
        if (rand > 0.9) type = types[2];
        else if (rand > 0.7) type = types[3];
        else if (rand > 0.4) type = types[1];

        const y = Math.floor(Math.random() * (type.yRange[1] - type.yRange[0])) + type.yRange[0];
        
        const el = document.createElement('div');
        el.className = `game-entity ${type.id === 'can' ? 'can' : 'fish'}`;
        el.innerText = type.icon;
        this.container.querySelector('#entities-container')?.appendChild(el);

        this.entities.push({
            id: Math.random().toString(),
            type: type.id,
            val: type.val,
            x: 420, // empieza fuera a la derecha
            y: y,
            el: el
        });
    }

    private updateEntities() {
        for (let i = this.entities.length - 1; i >= 0; i--) {
            let e = this.entities[i];
            e.x -= this.FISH_SPEED;
            if (e.x < -50) {
                e.el.remove();
                this.entities.splice(i, 1);
            }
        }
    }

    private updateHook() {
        if (this.hookState === 'dropping') {
            this.hookY += this.HOOK_SPEED;
            if (this.hookY > 340) {
                this.hookState = 'reeling';
            }
            this.checkCollisionsDown();
        } else if (this.hookState === 'reeling') {
            this.hookY -= this.HOOK_SPEED;
            if (this.hookY <= 50) {
                this.hookY = 50;
                if (this.caughtEntity) {
                    this.processCatch(this.caughtEntity);
                    this.caughtEntity.el.remove();
                    this.caughtEntity = null;
                }
                this.hookState = 'idle';
            } else {
                if (this.caughtEntity) this.checkCollisionsUp();
            }
        }
    }

    private checkCollisionsDown() {
        const hookEl = this.container.querySelector('#hook');
        const statusEl = this.container.querySelector('#game-status') as HTMLElement;

        if (!hookEl) return;
        const hookRect = hookEl.getBoundingClientRect();

        // punta del anzuelo
        const hookPoint = {
             x: hookRect.left + hookRect.width / 2,
             y: hookRect.bottom - 5
        };

        for (let i = 0; i < this.entities.length; i++) {
            let e = this.entities[i];
            const entityRect = e.el.getBoundingClientRect();

            // interseccion
            if (
                hookPoint.x >= entityRect.left && 
                hookPoint.x <= entityRect.right && 
                hookPoint.y >= entityRect.top && 
                hookPoint.y <= entityRect.bottom
            ) {
                // golpe
                if (e.type === 'can') {
                    this.score += e.val;
                    this.updateScoreDisplay();
                    this.flashMsg("-15! 💥");
                    this.hookState = 'reeling';
                } else {
                    this.hookState = 'waiting';
                    this.caughtEntity = e;
                    if (statusEl) statusEl.innerText = "Ya lo pescaste, ahora presiona espacio para volver";
                    e.el.style.transform = 'scale(1.4)';
                    e.el.style.filter = 'drop-shadow(0 0 10px gold)';
                }
                break;
            }
        }
    }

    private checkCollisionsUp() {
        const hookEl = this.container.querySelector('#hook');
        if (!hookEl) return;
        const hookRect = hookEl.getBoundingClientRect();
        
        const hookCenter = {
             x: hookRect.left + hookRect.width / 2,
             y: hookRect.top + hookRect.height / 2
        };


        for (let i = 0; i < this.entities.length; i++) {
            let e = this.entities[i];
            if (e === this.caughtEntity) continue;

            if (e.type === 'can') {
                const entityRect = e.el.getBoundingClientRect();
                 if (
                    hookCenter.x >= entityRect.left && 
                    hookCenter.x <= entityRect.right && 
                    hookCenter.y >= entityRect.top && 
                    hookCenter.y <= entityRect.bottom
                ) {
                    this.flashMsg("¡Se escapó! 🥫");
                    this.caughtEntity.el.remove();
                    this.caughtEntity = null;
                    break;
                }
            }
        }
    }

    private processCatch(e: any) {
        this.score += e.val;
        if (this.score > 150) this.score = 150;
        this.updateScoreDisplay();
        this.flashMsg(`+${e.val} ${e.el.innerText}`);
    }

    private renderHook() {
        const hookEl = this.container.querySelector('#hook') as HTMLElement;
        const lineEl = this.container.querySelector('#hook-line') as HTMLElement;
        if (hookEl && lineEl) {
            hookEl.style.top = `${this.hookY}px`;
            lineEl.style.height = `${this.hookY}px`;
            
            if (this.caughtEntity) {
                // fijar entidad
                this.caughtEntity.el.style.left = `calc(50% - 15px)`; 
                this.caughtEntity.el.style.top = `${this.hookY + 20}px`;
            }
        }
    }

    private renderEntities() {
        this.entities.forEach(e => {
            if (e !== this.caughtEntity) {
                e.el.style.left = `${e.x}px`;
                e.el.style.top = `${e.y}px`;
            }
        });
    }

    private updateScoreDisplay() {
        const s = this.container.querySelector('#f-score');
        if (s) s.textContent = this.score.toString();
    }

    private flashMsg(msg: string) {
        const statusEl = this.container.querySelector('#game-status') as HTMLElement; 
        if (statusEl) {
            statusEl.innerText = msg;
            setTimeout(() => { 
                if(statusEl.innerText === msg || statusEl.innerText === "¡Subiendo!") {
                    statusEl.innerText = "Usa ESPACIO para controlar el anzuelo.";
                }
            }, 1500);
        }
    }

    private async end(reason: string) {
        this.cleanup();
        const controls = this.container.querySelector('.game-controls');
        if (controls) controls.classList.remove('hidden');
        
        const btn = this.container.querySelector('#play-game-btn') as HTMLButtonElement | null;
        if (btn) btn.innerText = "JUGAR DE NUEVO";

        const statusEl = this.container.querySelector('#game-status') as HTMLElement; 
        let finalStatus = reason;
        if (this.score > 0) {
            finalStatus += ` Ganaste: ${this.score} monedas.`;
            try {
                await fetch(`${this.apiUrl}/collect`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: this.score, reward_id: null }) 
                });
                document.dispatchEvent(new Event('coin-collected'));
            } catch(e) { console.error(e); }
        } else {
            finalStatus += ` Perdiste.`;
        }
        if (statusEl) statusEl.innerText = finalStatus;
    }
}
