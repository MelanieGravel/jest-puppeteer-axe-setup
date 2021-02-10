const fs = require('fs');
const chalk = require('chalk');

const writeLog = (data, name) => {
    try {
        const dir = './logs';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        fs.writeFileSync('./logs/' + name + '.json', JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

const consoleLog = (results) => {
    console.log(chalk.cyan('-----------------------------'));
    console.log(chalk.cyan('-----------Summary-----------'));
    console.log(chalk.cyan('-----------------------------'));
    results.forEach((result) => {
        console.log(result.url)
        if (result.violations.length >= 10) {
            console.log(chalk.red(`Violations: ${result.violations.length}`));
        } else if (result.violations.length >= 5) {
            console.log(chalk.yellow(`Violations: ${result.violations.length}`));
        } else if (result.violations.length === 0) {
            console.log(chalk.green('No violation'))
        }
        console.log(' ');
    });

    console.log(chalk.yellowBright('-----------------------------'));
    console.log(chalk.yellowBright('-----------Details-----------'));
    console.log(chalk.yellowBright('-----------------------------'));

    results.forEach((result) => {
        console.log(' ');
        console.log(chalk.bold(`URL: ${result.url}`))
        console.log(chalk.bold('------------------'))
        console.log(' ');

        if(result.violations == 0) {
            drawBatman();
        } else {
            console.log(chalk.bgRed.whiteBright('Critical Violations'))
            logViolations(result.violations, 'critical');
            console.log(chalk.bgRed.whiteBright('---------------'))

            console.log(' ');
            console.log(chalk.bgMagenta.whiteBright('Serious Violations'))
            logViolations(result.violations, 'serious');
            console.log(chalk.bgMagenta.whiteBright('---------------'))

            console.log(' ');
            console.log(chalk.bgYellow.whiteBright('Moderate Violations'))
            logViolations(result.violations, 'moderate');
            console.log(chalk.bgYellow.whiteBright('---------------'))

            console.log(' ');
            console.log(chalk.bgGrey.whiteBright('Minor Violations'))
            logViolations(result.violations, 'minor');
            console.log(chalk.bgGrey.whiteBright('---------------'))
        }
    });
    console.log(chalk.yellowBright('-----------------------------'));

};

const logViolations = (violations, impact) => {
    let color;
    violations.forEach((violation) => {
        if (violation.impact === impact) {
            if (violation.impact === 'critical') {
                color = chalk.red;
            } else if (violation.impact === 'serious') {
                color = chalk.magenta;
            } else if (violation.impact === 'moderate') {
                color = chalk.yellow;
            } else if (violation.impact === 'minor') {
                color = chalk.grey;
            }
            console.log(color(violation.id));
            console.log(`Description: ${violation.description}`);
            console.log(`Advice: ${violation.help}`);
            console.log(color(`Problematic Nodes: ${violation.nodes.length}`));
            console.log(' ');
        }
    });
};

const drawBatman = (violations, impact) => {
    console.log(chalk.yellowBright('   You are a real superhero!!  '))
    console.log(chalk.yellowBright('       _,    _   _    ,_'))
    console.log(chalk.yellowBright('  .o888P     Y8o8Y     Y888o.'))
    console.log(chalk.yellowBright(' d88888      88888      88888b'))
    console.log(chalk.yellowBright('d888888b_  _d88888b_  _d888888b'))
    console.log(chalk.yellowBright('8888888888888888888888888888888'))
    console.log(chalk.yellowBright('8888888888888888888888888888888'))
    console.log(chalk.yellowBright('YJGS8P"Y888P"Y888P"Y888P"Y8888P'))
    console.log(chalk.yellowBright(' Y888   \'8\'   Y8P   \'8\'   888Y'))
    console.log(chalk.yellowBright('  \'8o          V          o8\''))
    console.log(chalk.yellowBright('    `                     `'))
};
//
// violations.forEach((violation) => {
//
// });

module.exports = {
    writeLog,
    consoleLog,
}
