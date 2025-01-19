const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const write = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

console.log('Welcome, enter your text');

stdin.on('data', (data) => {
  const userInput = data.toString();
  if (userInput === 'exit') {
    write.end();
    process.exit();
  }
  write.write(userInput);
});

process.on('SIGINT', () => {
  write.end();
  process.exit();
});

process.on('SIGTERM', () => {
  write.end();
  process.exit();
});

process.on('exit', () => {
  console.log('Writing is done');
});