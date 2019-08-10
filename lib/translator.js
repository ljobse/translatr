"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Translator {
    constructor(language) {
        this.language = language;
    }
    static initialize(translationDirectory, languagesToLoadUpfront = []) {
        return __awaiter(this, void 0, void 0, function* () {
            Translator.translationDirectory = translationDirectory;
            languagesToLoadUpfront.forEach(l => this.loadLanguage(l));
        });
    }
    static loadLanguage(language) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Translator.translations.hasOwnProperty(language)) {
                Translator.translations[language] = yield this.getFileContents(`${Translator.translationDirectory}/${language}.json`);
            }
            return Translator.translations[language];
        });
    }
    static getFileContents(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                fs.access(filePath, fs.constants.F_OK, err => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
            return JSON.parse(fs.readFileSync(filePath).toString());
        });
    }
    get(translationKeyPath, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const translations = yield Translator.loadLanguage(this.language);
            let translation = translationKeyPath
                .split('.')
                .reduce((previous, current) => {
                return previous[current] || '';
            }, translations);
            translation = this.replaceTags(translation, params);
            return translation || translationKeyPath;
        });
    }
    replaceTags(translation, params) {
        return params.reduce((previous, param) => previous.replace(`{${param.key}}`, param.value), translation);
    }
}
Translator.translations = {};
exports.default = Translator;
