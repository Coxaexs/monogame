const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Create HTTP server to serve files
const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.ico': 'image/x-icon',
    };
    
    const contentType = mimeTypes[extname] || 'application/octet-stream';
    
    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error: '+error.code);
            }
        } else {
            res.writeHead(200, { 
                'Content-Type': contentType,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            res.end(content, 'utf-8');
        }
    });
});

console.log('🟢 Starting Monopoly WebSocket server...');
// Create WebSocket server
const wss = new WebSocket.Server({ server });

// Game storage
const games = new Map();

// Helper functions
function generateGameId() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

function broadcastToGame(gameId, message, excludeClientId = null) {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && 
            client.gameId === gameId && 
            client.clientId !== excludeClientId) {
            client.send(JSON.stringify(message));
        }
    });
}

function getDefaultBoard() {
    return [
        { name: "GO", type: "go" },
        { name: "Mediterranean Ave", type: "property", price: 60, rent: [2, 10, 30, 90, 160, 250], color: "#a55a40", houseCost: 50 },
        { name: "Community Chest", type: "community_chest" },
        { name: "Baltic Ave", type: "property", price: 60, rent: [4, 20, 60, 180, 320, 450], color: "#a55a40", houseCost: 50 },
        { name: "Income Tax", type: "tax", amount: 200 },
        { name: "Reading Railroad", type: "railroad", price: 200 },
        { name: "Oriental Ave", type: "property", price: 100, rent: [6, 30, 90, 270, 400, 550], color: "#add8e6", houseCost: 50 },
        { name: "Chance", type: "chance" },
        { name: "Vermont Ave", type: "property", price: 100, rent: [6, 30, 90, 270, 400, 550], color: "#add8e6", houseCost: 50 },
        { name: "Connecticut Ave", type: "property", price: 120, rent: [8, 40, 100, 300, 450, 600], color: "#add8e6", houseCost: 50 },
        { name: "Jail / Just Visiting", type: "jail" },
        { name: "St. Charles Place", type: "property", price: 140, rent: [10, 50, 150, 450, 625, 750], color: "#d25298", houseCost: 100 },
        { name: "Electric Company", type: "utility", price: 150 },
        { name: "States Ave", type: "property", price: 140, rent: [10, 50, 150, 450, 625, 750], color: "#d25298", houseCost: 100 },
        { name: "Virginia Ave", type: "property", price: 160, rent: [12, 60, 180, 500, 700, 900], color: "#d25298", houseCost: 100 },
        { name: "Pennsylvania Railroad", type: "railroad", price: 200 },
        { name: "St. James Place", type: "property", price: 180, rent: [14, 70, 200, 550, 750, 950], color: "#f7941e", houseCost: 100 },
        { name: "Community Chest", type: "community_chest" },
        { name: "Tennessee Ave", type: "property", price: 180, rent: [14, 70, 200, 550, 750, 950], color: "#f7941e", houseCost: 100 },
        { name: "New York Ave", type: "property", price: 200, rent: [16, 80, 220, 600, 800, 1000], color: "#f7941e", houseCost: 100 },
        { name: "Free Parking", type: "free_parking" },
        { name: "Kentucky Ave", type: "property", price: 220, rent: [18, 90, 250, 700, 875, 1050], color: "#ed1c24", houseCost: 150 },
        { name: "Chance", type: "chance" },
        { name: "Indiana Ave", type: "property", price: 220, rent: [18, 90, 250, 700, 875, 1050], color: "#ed1c24", houseCost: 150 },
        { name: "Illinois Ave", type: "property", price: 240, rent: [20, 100, 300, 750, 925, 1100], color: "#ed1c24", houseCost: 150 },
        { name: "B. & O. Railroad", type: "railroad", price: 200 },
        { name: "Atlantic Ave", type: "property", price: 260, rent: [22, 110, 330, 800, 975, 1150], color: "#ffeb3b", houseCost: 150 },
        { name: "Ventnor Ave", type: "property", price: 260, rent: [22, 110, 330, 800, 975, 1150], color: "#ffeb3b", houseCost: 150 },
        { name: "Water Works", type: "utility", price: 150 },
        { name: "Marvin Gardens", type: "property", price: 280, rent: [24, 120, 360, 850, 1025, 1200], color: "#ffeb3b", houseCost: 150 },
        { name: "Go to Jail", type: "go_to_jail" },
        { name: "Pacific Ave", type: "property", price: 300, rent: [26, 130, 390, 900, 1100, 1275], color: "#4caf50", houseCost: 200 },
        { name: "North Carolina Ave", type: "property", price: 300, rent: [26, 130, 390, 900, 1100, 1275], color: "#4caf50", houseCost: 200 },
        { name: "Community Chest", type: "community_chest" },
        { name: "Pennsylvania Ave", type: "property", price: 320, rent: [28, 150, 450, 1000, 1200, 1400], color: "#4caf50", houseCost: 200 },
        { name: "Short Line", type: "railroad", price: 200 },
        { name: "Chance", type: "chance" },
        { name: "Park Place", type: "property", price: 350, rent: [35, 175, 500, 1100, 1300, 1500], color: "#2196f3", houseCost: 200 },
        { name: "Luxury Tax", type: "tax", amount: 100 },
        { name: "Boardwalk", type: "property", price: 400, rent: [50, 200, 600, 1400, 1700, 2000], color: "#2196f3", houseCost: 200 }
    ];
}

const defaultCards = {
    chance: [
        { text: "Advance to Go (Collect $200)", action: "move_to", space: 0, collect: true },
        { text: "Advance to Illinois Ave.", action: "move_to", space: 24 },
        { text: "Advance to St. Charles Place.", action: "move_to", space: 11 },
        { text: "Bank pays you dividend of $50.", action: "add_money", amount: 50 },
        { text: "Get Out of Jail Free.", action: "get_out_of_jail" },
        { text: "Go Back 3 Spaces.", action: "move_back", amount: 3 },
        { text: "Go to Jail. Go directly to Jail.", action: "go_to_jail" },
        { text: "Pay poor tax of $15.", action: "remove_money", amount: 15 },
        { text: "Your building loan matures. Collect $150.", action: "add_money", amount: 150 },
        { text: "Speeding fine $50.", action: "remove_money", amount: 50 },
        { text: "Pay school fees of $50.", action: "remove_money", amount: 50 },
        { text: "Take a trip to Reading Railroad.", action: "move_to", space: 5 },
        { text: "Advance to Boardwalk.", action: "move_to", space: 39 },
        { text: "Make general repairs on all properties. $25 per house, $100 per hotel.", action: "repair", house: 25, hotel: 100 },
    ],
    community_chest: [
        { text: "Advance to Go (Collect $200).", action: "move_to", space: 0, collect: true },
        { text: "Bank error in your favor. Collect $200.", action: "add_money", amount: 200 },
        { text: "Doctor's fees. Pay $50.", action: "remove_money", amount: 50 },
        { text: "From sale of stock you get $50.", action: "add_money", amount: 50 },
        { text: "Get Out of Jail Free.", action: "get_out_of_jail" },
        { text: "Go to Jail. Go directly to Jail.", action: "go_to_jail" },
        { text: "Holiday fund matures. Receive $100.", action: "add_money", amount: 100 },
        { text: "Income tax refund. Collect $20.", action: "add_money", amount: 20 },
        { text: "Life insurance matures. Collect $100.", action: "add_money", amount: 100 },
        { text: "Pay hospital fees of $100.", action: "remove_money", amount: 100 },
        { text: "You inherit $100.", action: "add_money", amount: 100 },
        { text: "You have won second prize in a beauty contest. Collect $10.", action: "add_money", amount: 10 },
        { text: "Receive $25 consultancy fee.", action: "add_money", amount: 25 },
        { text: "Street repairs. $40 per house, $115 per hotel.", action: "repair", house: 40, hotel: 115 },
    ]
};

// WebSocket connection handler
// WebSocket connection handler
wss.on('connection', (ws, req) => {
    ws.clientId = Math.random().toString(36).substring(7);
    const ip = req && req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'unknown';
    console.log(`✅ Client connected: ${ws.clientId} from ${ip}`);
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log(`📩 Received from ${ws.clientId}:`, message.type);
            
            switch(message.type) {
                case 'create_game':
                    handleCreateGame(ws, message);
                    break;
                case 'join_game':
                    handleJoinGame(ws, message);
                    break;
                case 'start_game':
                    handleStartGame(ws, message);
                    break;
                case 'update_game':
                    handleUpdateGame(ws, message);
                    break;
                case 'get_game':
                    handleGetGame(ws, message);
                    break;
                default:
                    ws.send(JSON.stringify({ type: 'error', message: 'Unknown message type' }));
            }
        } catch (error) {
            console.error('❌ Error processing message:', error);
            ws.send(JSON.stringify({ type: 'error', message: error.message }));
        }
    });
    
    ws.on('close', () => {
        console.log(`❌ Client disconnected: ${ws.clientId}`);
    });
});

function handleCreateGame(ws, message) {
    const gameId = message.gameId || generateGameId();
    const { player, settings } = message;
    
    const newGame = {
        gameId,
        hostId: player.id,
        players: [player],
        state: 'lobby',
        settings: {
            ...settings,
            board: settings.board || getDefaultBoard()
        },
        trade: null,
        createdAt: Date.now()
    };
    
    games.set(gameId, newGame);
    ws.gameId = gameId;
    
    ws.send(JSON.stringify({
        type: 'game_created',
        gameId,
        game: newGame
    }));
    
    console.log(`🎮 Game created: ${gameId}`);
}

function handleJoinGame(ws, message) {
    const { gameId, player } = message;
    const game = games.get(gameId);
    
    if (!game) {
        ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
        return;
    }
    
    // Allow joining even if game is playing (late join)
    const isLateJoin = game.state === 'playing';
    
    if (!isLateJoin && game.players.length >= game.settings.maxPlayers) {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        return;
    }
    
    // If late joining, give player starting money
    if (isLateJoin) {
        player.money = game.settings.startingMoney || 1500;
        player.position = 0;
        player.inJail = false;
        player.jailTurns = 0;
        player.isBankrupt = false;
        player.isLucky = false;
        player.luckyTurnsLeft = 0;
        player.jailCount = 0;
        player.doublesCount = 0;
        console.log(`🎮 Late join: ${player.name} joining with $${player.money}`);
    }
    
    // Check if player already in game
    if (!game.players.find(p => p.id === player.id)) {
        game.players.push(player);
    }
    
    ws.gameId = gameId;
    
    // Send game state to joining player
    ws.send(JSON.stringify({
        type: 'game_joined',
        gameId,
        game
    }));
    
    // Broadcast to all other players
    broadcastToGame(gameId, {
        type: 'game_updated',
        game
    }, ws.clientId);
    
    console.log(`👤 Player ${player.name} joined game ${gameId}`);
}

function handleStartGame(ws, message) {
    const { gameId, settings, players } = message;
    const game = games.get(gameId);
    
    if (!game) {
        ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
        return;
    }
    
    // Update settings and players if provided
    if (settings) {
        game.settings = { ...game.settings, ...settings };
    }
    if (players) {
        game.players = players;
    }
    
    // Initialize game state
    game.state = 'playing';
    game.properties = game.settings.board.map((p, i) => ({ 
        spaceIndex: i, 
        ownerId: null, 
        houses: 0 
    }));
    game.currentPlayerIndex = 0;
    game.turnState = 'start';
    game.lastDiceRoll = [0, 0];
    game.gameLog = [`Game started with ${game.players.length} players! It's ${game.players[0].name}'s turn.`];
    
    // Broadcast game start to all players
    broadcastToGame(gameId, {
        type: 'game_started',
        game
    });
    
    // Also send to the host
    ws.send(JSON.stringify({
        type: 'game_started',
        game
    }));
    
    console.log(`🚀 Game ${gameId} started with ${game.players.length} players`);
}

function handleUpdateGame(ws, message) {
    const { gameId, updates } = message;
    const game = games.get(gameId);
    
    if (!game) {
        ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
        return;
    }
    
    // Apply updates to game state
    Object.assign(game, updates);
    
    // Broadcast to all players including sender
    broadcastToGame(gameId, {
        type: 'game_updated',
        game
    });
    
    // Also send to sender
    ws.send(JSON.stringify({
        type: 'game_updated',
        game
    }));
}

function handleGetGame(ws, message) {
    const { gameId } = message;
    const game = games.get(gameId);
    
    if (!game) {
        ws.send(JSON.stringify({ type: 'error', message: 'Game not found' }));
        return;
    }
    
    ws.gameId = gameId;
    ws.send(JSON.stringify({
        type: 'game_state',
        game
    }));
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`🔌 WebSocket server ready`);
});
