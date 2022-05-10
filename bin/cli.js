#!/usr/bin/env node

const {Command} = require("commander");

const program = new Command()

program.version(require('../package.json').version, '-v, -V', '输出当前框架的版本')
    .description('这是月亮的框架')
    .usage(`<command> [options]`)
    .parse()

program.command('dev').description('框架开发命令').action(() => {
    const {dev} = require('../lib/dev')
    dev()
}).parse()





