const bedrock = require('bedrock-protocol');
const { log } = require('./logger');
const config = require('./config.json');

// Função para criar o cliente e conectar ao servidor
function createClient() {
  const client = bedrock.createClient({
    host: config.host,
    port: config.port,
    username: config.username,
  });

  // Log ao conectar no servidor
  client.on('join', () => {
    log(`${config.username} conectado ao servidor ${config.host}:${config.port}`);

    // Exibir "estou online" no console a cada 30 segundos
    setInterval(() => {
      log('estou online');
    }, 30000); // 30000 milissegundos = 30 segundos
  });

  // Evento para capturar logs de erro
  client.on('error', (err) => {
    log(`Erro no bot: ${err}`);
  });

  // Evento para capturar a desconexão
  client.on('close', () => {
    log('Bot foi desconectado.');
    log('Tentando reconectar em 10 segundos...');
    setTimeout(() => {
      log('Reconectando...');
      createClient(); // Recria o cliente para reconectar
    }, 10000); // Reconectar após 10 segundos
  });

  // Log de todas as mensagens recebidas no chat
  client.on('text', (packet) => {
    const { message, source_name } = packet;
    log(`${source_name}: ${message}`);
  });
}

// Iniciar o bot
createClient();
