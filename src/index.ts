import fs from 'fs'
import path from 'path'
import * as cheerio from 'cheerio'
import _ from 'lodash'
export interface InjectorOptions {
    baseUrl: string
}

export function injector(html:string, inputOptions?:Partial<InjectorOptions>) {
    const $ = cheerio.load(html);
    const options:InjectorOptions = _.defaults(inputOptions, {
        baseUrl: '',
        callbackUrl: ''
    })

    if (!$('base').length && options.baseUrl) {
        $('head').prepend(`<base href="${ options.baseUrl }">`);
    }

    const code = fs.readFileSync(path.join(__dirname, './script.js'), 'utf8')
    $('head').append(`
        <script>${ code }</script>
        <style>
            .htmlSelectorSelected { border: 3px solid blue !important;}
            .htmlSelectorCurrent { border: 3px solid red !important;}
        </style>
    `)


    return $.html()
}