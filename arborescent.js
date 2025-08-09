import fs from 'fs';
import path from 'path';

const ignoreDirs = ['node_modules', '.git'];

function tree(dir, prefix = '') {
  if (ignoreDirs.includes(path.basename(dir))) {
    return;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });
  const lastIndex = items.length - 1;

  items.forEach((item, index) => {
    const isLast = index === lastIndex;
    const pointer = isLast ? '└── ' : '├── ';
    console.log(prefix + pointer + item.name);

    if (item.isDirectory()) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');
      tree(path.join(dir, item.name), newPrefix);
    }
  });
}

const rootDir = process.argv[2] || '.';

console.log(rootDir);
tree(rootDir);
