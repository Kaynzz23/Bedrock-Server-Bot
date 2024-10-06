const fs = require('fs');
const path = require('path');

// Função para gravar logs em arquivo e no console
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);

  // Salvar log em arquivo
  const logFilePath = path.join(__dirname, 'bot.log');
  fs.appendFileSync(logFilePath, logMessage + '\n');
}

// Função para limpar o log
function clearLog() {
  const logFilePath = path.join(__dirname, 'bot.log');
  fs.truncate(logFilePath, 0, (err) => {
    if (err) {
      console.error('Erro ao apagar log:', err);
    } else {
      console.log('Conteúdo do bot.log apagado.');
    }
  });
}

module.exports = { log, clearLog };
