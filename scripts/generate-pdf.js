'use strict';

const argv      = require('minimist')(process.argv.slice(2));
const path      = require("path");
const puppeteer = require('puppeteer');

const sourceFile = path.resolve(argv._[0]);
const outputFile = path.resolve(argv._[1]);

(async() => {
    // Instanciate the browser.
    // Note that running inside a docker requires special arguments.
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      executablePath: 'google-chrome-unstable',
    })

    // Open the source page.
    const page = await browser.newPage();
    await page.goto('file://' + sourceFile,  {
      waitUntil: 'networkidle2', // https://github.com/GoogleChrome/puppeteer/issues/422
    });

    // Generate the pdf from the page.
    await page.pdf({
      format: 'A4',
      path: outputFile,
      printBackground: true,
    }).catch(console.error);

    await browser.close();
})();
