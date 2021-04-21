import { spawn } from './spawn';
import { createConsoleLogger } from '@iamyth/logger';
import path from 'path';
import fs from 'fs-extra';

const logger = createConsoleLogger('TypeScript Compiler');

require('./format');
require('./lint');

function build() {
    logger.task('Build and Transpile');
    spawn('tsc', ['--project', path.join(__dirname, '../config/tsconfig.src.json')], 'Build Failed.');
    fs.copySync(path.join(__dirname, '../src/template'), path.join(__dirname, '../dist/template'));
}

build();
