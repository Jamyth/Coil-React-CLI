import { createConsoleLogger } from '@iamyth/logger';
import yargs from 'yargs';
import fs from 'fs-extra';
import path from 'path';
import { ReplaceUtil } from './util/ReplaceUtil';
import { NameUtil } from './util/NameUtil';

interface UpdateContentConfig {
    path: string;
    iterator: (1 | 2 | 3)[];
    target: string[];
}

export class CoilReactCLI {
    private readonly moduleDirectory: string;
    private readonly name: string;
    private readonly rootPath: string;
    private readonly templatePath;
    private readonly logger = createConsoleLogger('Coil React CLI');

    constructor() {
        this.name = String(yargs.argv._[0]);
        this.rootPath = path.join();
        this.moduleDirectory = this.getModuleDirectory();
        this.templatePath = path.join(__dirname, './template');
    }

    run() {
        try {
            this.checkPreCondition();
            this.createModuleDirectory();
            this.copyTemplate();
            this.updateTemplate();
        } catch (error) {
            try {
                fs.rmdirSync(this.moduleDirectory, { recursive: true });
            } catch (error) {
                // Do nothing
            }
            this.logger.error(error);
            process.exit(1);
        }
    }

    private getModuleDirectory() {
        if (process.env.NODE_ENV === 'COIL_REACT_TEST') {
            return path.join(this.rootPath, './test/src/module/', this.name);
        }
        return path.join(this.rootPath, './src/module/', this.name);
    }

    private checkPreCondition() {
        this.logger.task('start checking Pre-Condition...');
        if (this.name === 'undefined') {
            throw new Error('Module name is not defined.');
        }
        if (!this.name.trim()) {
            throw new Error('Module name is invalid.');
        }
    }

    private createModuleDirectory() {
        this.logger.task('Create Module Directory...');
        if (fs.existsSync(this.moduleDirectory) && fs.statSync(this.moduleDirectory).isDirectory()) {
            throw new Error(`Folder is exist: ${this.moduleDirectory}`);
        }
        fs.mkdirSync(this.moduleDirectory, { recursive: true });
    }

    private copyTemplate() {
        this.logger.task(`Copying Module Template to ${this.moduleDirectory}`);
        const directories = ['Main'];

        for (const directory of directories) {
            fs.mkdirSync(`${this.moduleDirectory}/${directory}`, { recursive: true });
        }

        const mainFiles = ['Main/index.tsx'];
        const moduleFiles = ['hooks.ts', 'index.ts', 'type.ts'];

        for (const file of [...mainFiles, ...moduleFiles]) {
            fs.copyFileSync(`${this.templatePath}/${file}.template`, `${this.moduleDirectory}/${file}`);
        }
    }

    private updateTemplate() {
        this.logger.task(`Update Template Content`);
        const configs: UpdateContentConfig[] = [
            {
                path: path.join(this.moduleDirectory, './index.ts'),
                iterator: [1],
                target: [NameUtil.transformCase(this.name, 'pascal')],
            },
            {
                path: path.join(this.moduleDirectory, './hooks.ts'),
                iterator: [1, 2],
                target: [NameUtil.transformCase(this.name, 'pascal'), this.name],
            },
        ];

        for (const { path, iterator, target } of configs) {
            const content = fs.readFileSync(path, { encoding: 'utf-8' });
            const newContent = ReplaceUtil.replaceTemplate(content, iterator, target);
            fs.writeFileSync(path, newContent, { encoding: 'utf-8' });
        }
    }
}
