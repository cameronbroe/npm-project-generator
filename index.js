const fs = require('fs');
const conv = require('number-to-words');

let config;

function loadConfig() {
    config = JSON.parse(fs.readFileSync('./config.json'));
}

async function generateModule(number) {
    let moduleLocals = {
        num: number,
        name: `is-${conv.toWords(number)}`.replace(/\s/g, '-'),
        author: config.author
    }
    if(!fs.existsSync('build/')) {
        fs.mkdirSync('build/');
    }

    if(!fs.existsSync(`build/${moduleLocals.name}/`)) {
        fs.mkdirSync(`build/${moduleLocals.name}/`);
    }

    let indexJs = await parseTemplate('template/index.js.tmpl', moduleLocals);
    let packageJson = await parseTemplate('template/package.json.tmpl', moduleLocals);
    let writeCallback = (err) => {
        if(err) throw err;
        // console.log(`${moduleLocals.name} file written`);
    }
    fs.writeFile(`build/${moduleLocals.name}/index.js`, indexJs, writeCallback);
    fs.writeFile(`build/${moduleLocals.name}/package.json`, packageJson, writeCallback);
}

async function parseTemplate(filename, locals) {
    let templateStr = fs.readFileSync(filename, { encoding: 'utf-8' });
    Object.keys(locals).forEach((key) => {
        templateStr = templateStr.replace(`|=${key}=|`, locals[key]);
    });
    return templateStr;
}

function getRandomInt(min = 1, max = 1000000000000000) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function main() {
    loadConfig();

    for(i = 0; i < 1000; i++) {
        generateModule(getRandomInt());
    }
}

if(require.main === module) {
    main()
}
