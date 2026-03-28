export class Connect4Game {
    private apiUrl: string;
    private container: HTMLElement;
    
    private board: number[][] = [];
    private rows = 6;
    private cols = 7;
    private currentPlayer: number = 1; // 1 = Jugador, 2 = AI
    private gameActive: boolean = false;
    private aiThinking: boolean = false;

    private easterEggUnlocked = false;
    private clickCount = 0;

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
            <div class="c4-stats">
              <div class="linus-panel">
                <span id="linus-avatar">🐧</span>
                <span id="linus-msg">¿Te atreves a retar a Linus?</span>
              </div>
            </div>
            <div id="c4-board" class="c4-board"></div>
            <div class="game-controls">
                <div id="game-status" class="status-msg">Presiona JUGAR para comenzar</div>
                <button id="play-game-btn" class="btn reward">JUGAR (75 Coins)</button>
            </div>
            
            <style>
                .c4-stats {
                    position: absolute;
                    top: 10px;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    pointer-events: none;
                }
                .linus-panel {
                    background: rgba(0,0,0,0.8);
                    border: 2px solid #555;
                    padding: 5px 15px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #fff;
                    font-family: monospace;
                    font-size: 0.8rem;
                    pointer-events: auto; /* for clicks */
                    cursor: pointer;
                }
                #linus-avatar {
                    font-size: 1.5rem;
                }
                .c4-board {
                    display: grid;
                    grid-template-columns: repeat(7, 30px);
                    grid-template-rows: repeat(6, 30px);
                    gap: 5px;
                    background: rgba(0, 0, 0, 0.4); 
                    padding: 10px;
                    border-radius: 10px;
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 0 15px rgba(0,0,0,0.5);
                    margin-top: 69px; 
                    pointer-events: none;
                    opacity: 0.5;
                }
                .c4-cell {
                    width: 30px;
                    height: 30px;
                    background: rgba(0, 0, 0, 0.6);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: background 0.2s, transform 0.3s;
                    box-shadow: inset 0 0 5px rgba(0,0,0,0.8);
                }
                .c4-cell:hover {
                    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.2);
                }
                .c4-cell.p1 {
                    background: #5d4037; /* Marrón oscuro */
                    box-shadow: inset 0 0 5px rgba(0,0,0,0.5), 0 0 8px #5d4037;
                    animation: dropIn 0.3s ease-out;
                }
                .c4-cell.p2 {
                    background: #aed581; /* Verde claro */
                    box-shadow: inset 0 0 5px rgba(0,0,0,0.5), 0 0 8px #aed581;
                    animation: dropIn 0.3s ease-out;
                }
                .c4-cell.win-pulse {
                    animation: winPulse 1s infinite alternate;
                }
                @keyframes dropIn {
                    from { transform: translateY(-100px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes winPulse {
                    from { transform: scale(1); filter: brightness(1); }
                    to { transform: scale(1.1); filter: brightness(1.5); }
                }
                .rm-btn {
                    position: absolute;
                    bottom: 10px;
                    left: 10px;
                    background: red;
                    color: white;
                    font-weight: bold;
                    border: 2px solid white;
                    padding: 5px;
                    cursor: pointer;
                    font-family: monospace;
                    display: none;
                }
            </style>
            <button id="rm-rf-btn" class="rm-btn">sudo rm -rf /col</button>
        `;

        const btn = this.container.querySelector('#play-game-btn');
        if (btn) btn.addEventListener('click', () => this.tryStartGame());

        const linus = this.container.querySelector('.linus-panel');
        if (linus) {
            linus.addEventListener('click', () => {
                this.clickCount++;
                if (this.clickCount === 7 && !this.easterEggUnlocked && this.gameActive) {
                    this.easterEggUnlocked = true;
                    this.setLinusMsg("¿Un backdoor? Usando permisos root concedidos...");
                    const rmBtn = this.container.querySelector('#rm-rf-btn') as HTMLElement;
                    if(rmBtn) rmBtn.style.display = 'block';
                }
            });
        }

        const rmBtn = this.container.querySelector('#rm-rf-btn');
        if (rmBtn) {
            rmBtn.addEventListener('click', () => {
                if (this.easterEggUnlocked && !this.aiThinking && this.gameActive) {
                    this.setLinusMsg("Has purgado la columna central... muy sucio.");
                    for (let r = 0; r < this.rows; r++) {
                        this.board[r][3] = 0;
                    }
                    this.renderBoard();
                    rmBtn.remove();
                    this.easterEggUnlocked = false;
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
        this.board = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
        this.gameActive = true;
        this.currentPlayer = 1;
        this.aiThinking = false;
        this.clickCount = 0;
        this.easterEggUnlocked = false;

        const rmBtn = this.container.querySelector('#rm-rf-btn') as HTMLElement;
        if(rmBtn) rmBtn.style.display = 'none';

        const boardEl = this.container.querySelector('#c4-board') as HTMLElement;
        if (boardEl) {
            boardEl.style.opacity = '1';
            boardEl.style.pointerEvents = 'auto';
            this.renderBoard();
        }

        this.setLinusMsg("El compilador está listo. Haz tu movimiento (O(1)).");
    }

    private setLinusMsg(msg: string) {
        const el = this.container.querySelector('#linus-msg');
        if (el) el.textContent = msg;
    }

    private renderBoard() {
        const boardEl = this.container.querySelector('#c4-board') as HTMLElement;
        if (!boardEl) return;
        boardEl.innerHTML = '';
        
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const cell = document.createElement('div');
                cell.className = 'c4-cell';
                if (this.board[r][c] === 1) cell.classList.add('p1');
                else if (this.board[r][c] === 2) cell.classList.add('p2');
                cell.id = `cell-${r}-${c}`;

                cell.addEventListener('click', () => this.handlePlayerMove(c));
                boardEl.appendChild(cell);
            }
        }
    }

    private handlePlayerMove(col: number) {
        if (!this.gameActive || this.aiThinking) return;

        if (this.dropPiece(col, 1)) {
            this.renderBoard();
            
            const winRes = this.checkWin(1);
            if (winRes) {
                this.endGame(1, winRes);
            } else if (this.isBoardFull()) {
                this.endGame(0, null);
            } else {
                this.aiThinking = true;
                this.setLinusMsg("Analizando árbol Minimax...");
                setTimeout(() => this.makeAIMove(), 500); // Pequeña pausa para efecto
            }
        }
    }

    private dropPiece(col: number, player: number): boolean {
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) {
                this.board[r][col] = player;
                return true;
            }
        }
        return false;
    }

    private makeAIMove() {
        if (!this.gameActive) return;

        let bestScore = -Infinity;
        let bestCol = Math.floor(this.cols / 2); // default al medio
        const depth = 5; 
        const columnOrder = [3, 2, 4, 1, 5, 0, 6];

        for (const col of columnOrder) {
            if (this.canDrop(col)) {
                const r = this.getDropRow(col);
                this.board[r][col] = 2; // AI
                let score = this.minimax(depth - 1, -Infinity, Infinity, false);
                this.board[r][col] = 0; // undo
                
                if (score > bestScore) {
                    bestScore = score;
                    bestCol = col;
                }
            }
        }

        this.dropPiece(bestCol, 2);
        this.renderBoard();

        const winRes = this.checkWin(2);
        if (winRes) {
            this.endGame(2, winRes);
        } else if (this.isBoardFull()) {
            this.endGame(0, null);
        } else {
            const taunts = [
                "Esa jugada tiene complejidad O(n!). Ineficiente.",
                "Mi kernel nunca fallaría así.",
                "Deberías leer la documentación del Conecta 4.",
                "Tu poda alfa-beta es débil.",
                "Casi tan malo como usar espacios en vez de tabs."
            ];
            this.setLinusMsg(taunts[Math.floor(Math.random() * taunts.length)]);
            this.aiThinking = false;
        }
    }

    private canDrop(col: number): boolean {
        return this.board[0][col] === 0;
    }

    private getDropRow(col: number): number {
        for (let r = this.rows - 1; r >= 0; r--) {
            if (this.board[r][col] === 0) return r;
        }
        return -1;
    }

    private minimax(depth: number, alpha: number, beta: number, isMaximizing: boolean): number {
        if (this.checkWin(2)) return 1000000 + depth;
        if (this.checkWin(1)) return -1000000 - depth;
        if (this.isBoardFull() || depth === 0) {
            return this.evaluateBoard();
        }

        const columnOrder = [3, 2, 4, 1, 5, 0, 6];

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const col of columnOrder) {
                if (this.canDrop(col)) {
                    const r = this.getDropRow(col);
                    this.board[r][col] = 2;
                    let ev = this.minimax(depth - 1, alpha, beta, false);
                    this.board[r][col] = 0;
                    maxEval = Math.max(maxEval, ev);
                    alpha = Math.max(alpha, ev);
                    if (beta <= alpha) break;
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const col of columnOrder) {
                if (this.canDrop(col)) {
                    const r = this.getDropRow(col);
                    this.board[r][col] = 1;
                    let ev = this.minimax(depth - 1, alpha, beta, true);
                    this.board[r][col] = 0;
                    minEval = Math.min(minEval, ev);
                    beta = Math.min(beta, ev);
                    if (beta <= alpha) break;
                }
            }
            return minEval;
        }
    }

    private evaluateBoard(): number {
        let score = 0;
        let centerArray = [];
        for (let r = 0; r < this.rows; r++) {
            centerArray.push(this.board[r][3]);
        }
        let centerCount = centerArray.filter(p => p === 2).length;
        score += centerCount * 3;

        // Evaluar ventanas de 4
        // Horizontal
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                let window = [this.board[r][c], this.board[r][c+1], this.board[r][c+2], this.board[r][c+3]];
                score += this.evaluateWindow(window);
            }
        }
        // Vetical
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows - 3; r++) {
                let window = [this.board[r][c], this.board[r+1][c], this.board[r+2][c], this.board[r+3][c]];
                score += this.evaluateWindow(window);
            }
        }
        // Diagonal positiva
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                let window = [this.board[r][c], this.board[r+1][c+1], this.board[r+2][c+2], this.board[r+3][c+3]];
                score += this.evaluateWindow(window);
            }
        }
        // Diagonal negativa
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                let window = [this.board[r+3][c], this.board[r+2][c+1], this.board[r+1][c+2], this.board[r][c+3]];
                score += this.evaluateWindow(window);
            }
        }
        return score;
    }

    private evaluateWindow(window: number[]): number {
        let score = 0;
        let ai = window.filter(p => p === 2).length;
        let player = window.filter(p => p === 1).length;
        let empty = window.filter(p => p === 0).length;

        if (ai === 4) score += 100;
        else if (ai === 3 && empty === 1) score += 5;
        else if (ai === 2 && empty === 2) score += 2;

        if (player === 3 && empty === 1) score -= 4; // priorizar bloquear

        return score;
    }

    private checkWin(player: number): number[][] | null {
        // Horizontal
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (this.board[r][c] === player && this.board[r][c+1] === player && this.board[r][c+2] === player && this.board[r][c+3] === player) {
                    return [[r,c], [r,c+1], [r,c+2], [r,c+3]];
                }
            }
        }
        // Vertical
        for (let c = 0; c < this.cols; c++) {
            for (let r = 0; r < this.rows - 3; r++) {
                if (this.board[r][c] === player && this.board[r+1][c] === player && this.board[r+2][c] === player && this.board[r+3][c] === player) {
                    return [[r,c], [r+1,c], [r+2,c], [r+3,c]];
                }
            }
        }
        // Diagonal Positiva
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (this.board[r][c] === player && this.board[r+1][c+1] === player && this.board[r+2][c+2] === player && this.board[r+3][c+3] === player) {
                    return [[r,c], [r+1,c+1], [r+2,c+2], [r+3,c+3]];
                }
            }
        }
        // Diagonal Negativa
        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.cols - 3; c++) {
                if (this.board[r][c] === player && this.board[r-1][c+1] === player && this.board[r-2][c+2] === player && this.board[r-3][c+3] === player) {
                    return [[r,c], [r-1,c+1], [r-2,c+2], [r-3,c+3]];
                }
            }
        }
        return null;
    }

    private isBoardFull(): boolean {
        for (let c = 0; c < this.cols; c++) {
            if (this.board[0][c] === 0) return false;
        }
        return true;
    }

    private async endGame(winner: number, winCoords: number[][] | null) {
        this.gameActive = false;
        
        if (winCoords) {
            // Animar ficha ganadora
            for (const [r, c] of winCoords) {
                const cell = this.container.querySelector(`#cell-${r}-${c}`);
                if (cell) cell.classList.add('win-pulse');
            }
        }

        const controls = this.container.querySelector('.game-controls');
        if (controls) controls.classList.remove('hidden');
        
        const btn = this.container.querySelector('#play-game-btn') as HTMLButtonElement | null;
        if (btn) btn.innerText = "JUGAR DE NUEVO";

        const boardEl = this.container.querySelector('#c4-board') as HTMLElement;
        if (boardEl) boardEl.style.pointerEvents = 'none';

        if (winner === 1) {
            this.setLinusMsg("¡Imposible! ...Seguro encontraste un bug en mi código.");
            try {
                const userId = this.getUserId();
                await fetch(`${this.apiUrl}/reward_coins`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'X-User-ID': userId.toString()
                    },
                    body: JSON.stringify({ amount: 150, reward_id: null }) 
                });
                document.dispatchEvent(new Event('coin-collected'));
                const status = this.container.querySelector('#game-status') as HTMLElement;
                if(status) status.innerText = "¡Ganaste 150 monedas!";
            } catch(e) { console.error(e); }
        } else if (winner === 2) {
            this.setLinusMsg("Git commit -m 'Victoria sobre humano'.");
            const status = this.container.querySelector('#game-status') as HTMLElement;
            if(status) status.innerText = "Perdiste. Linus gana.";
        } else {
            this.setLinusMsg("Empate. Código espagueti por ambos lados.");
            try {
                const userId = this.getUserId();
                await fetch(`${this.apiUrl}/reward_coins`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'X-User-ID': userId.toString() },
                    body: JSON.stringify({ amount: 75, reward_id: null }) 
                });
                document.dispatchEvent(new Event('coin-collected'));
                const status = this.container.querySelector('#game-status') as HTMLElement;
                if(status) status.innerText = "Empate. Recuperas tus 75 monedas.";
            } catch(e) { console.error(e); }
        }
    }

    public cleanup() {
        this.gameActive = false;
    }
}