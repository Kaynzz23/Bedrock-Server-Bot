const express = require("express");
const http = require("http");
const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const app = express();

app.use(express.json());
app.get("/", (_, res) => res.sendFile(__dirname + "/index.html"));
app.listen(process.env.PORT);

// Mantém o servidor Replit ativo
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.repl.co/`);
}, 900000);

function createBot() {
  const bot = mineflayer.createBot({
    host: 'MineDaDrg.aternos.me',
    version: '1.20.1', // Ajuste conforme necessário
    username: 'DRGbot',
    port: 51233
  });

  // Importa o módulo de pathfinding
  bot.loadPlugin(pathfinder);

  bot.on('kicked', (reason) => {
    console.log(`Fui expulso do servidor. Motivo: ${reason}`);
  });

  bot.on('error', (err) => {
    console.log(`Erro detectado: ${err.message}`);
  });

  bot.on('end', () => {
    console.log('Bot desconectado! Tentando reconectar em 30 segundos...');
    setTimeout(createBot, 30000);
  });

  bot.on('spawn', () => {
    const defaultMove = new Movements(bot, bot.world);
    bot.pathfinder.setMovements(defaultMove);

    // Verificar o tempo e tentar dormir à noite
    bot.on('time', () => {
      if (bot.time.isNight) {
        const bed = bot.findBlock({
          matching: block => bot.isABed(block)
        });

        if (bed) {
          console.log('Cama encontrada! Movendo até ela...');
          bot.pathfinder.setGoal(new goals.GoalBlock(bed.position.x, bed.position.y, bed.position.z));

          bot.once('goal_reached', () => {
            bot.sleep(bed, (err) => {
              if (err) {
                console.log('Não consegui dormir:', err.message);
              } else {
                console.log('O bot está dormindo!');
              }
            });
          });
        } else {
          console.log('Nenhuma cama encontrada para dormir.');
        }
      }
    });
  });
}

createBot();
