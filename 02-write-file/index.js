const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const write = fs.createWriteStream(path.resolve(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});

console.log('Welcome, enter your text');

stdin.on('data', (data) => {
  const userInput = data.toString().trim();
  if (userInput.toLowerCase() === 'exit') {
    console.log('Goodbye! Thanks for using the application.');
    write.end();
    process.exit(0);
  }
  write.write(userInput + '\n');
});

process.on('SIGINT', () => {
  write.end();
  process.exit(0);
});

process.on('SIGTERM', () => {
  write.end();
  process.exit(0);
});

process.on('exit', () => {
  console.log('Writing is done');
});