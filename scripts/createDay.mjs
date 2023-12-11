import process from 'node:process';
import path from 'node:path';
import {copyFile, readFile, writeFile, mkdir} from 'node:fs/promises';
import {constants} from 'node:fs';

const myArgs = process.argv.slice(2);
let day;
if (myArgs.length === 0) {
    day = new Date().getDate();
} else {
    day = parseInt(myArgs[0]);
}
const padLeft = (day) => (day < 10 ? "0" : "") + day;
const firstSunday = 3;
const folderNumber = Math.floor((day + firstSunday) / 7);
const endOfWeek = Math.min(25, folderNumber * 7 + firstSunday);
const startOfWeek = Math.max(1, folderNumber * 7 + firstSunday - 6);

const folder = path.join('.', `${padLeft(startOfWeek)}-${padLeft(endOfWeek)}`)
const filenames = [`${padLeft(day)}.ts`, `${padLeft(day)}-data.ts`].map(f => path.join(folder, f));
const sources = ['template.ts', 'template-data.ts'].map(f => path.join('.', 'scripts', 'template', f))

const replacer = /template/g;

try {
    await mkdir(folder, {recursive: true});
    await Promise.all(filenames.map((p, i) => copyFile(sources[i], p, constants.COPYFILE_EXCL)));
    console.log(`${filenames.length} files copied`);
    await Promise.all(filenames.map(async (f) => {
        const content = await readFile(f, 'utf8');
        writeFile(f, content.replace(replacer, padLeft(day)), 'utf8');
    }));
    console.log(`${filenames.length} files modified`)
} catch (e) {
    console.error(e);
}

