import * as fs from 'fs';

import TranslatorParam from './translatorParam';

class Translator {
  public static async initialize(
    translationDirectory: string,
    languagesToLoadUpfront: string[] = []
  ) {
    Translator.translationDirectory = translationDirectory;
    languagesToLoadUpfront.forEach(l => this.loadLanguage(l));
  }

  private static translations: any = {};
  private static translationDirectory: string;

  private static async loadLanguage(language: string) {
    if (!Translator.translations.hasOwnProperty(language)) {
      Translator.translations[language] = await this.getFileContents(
        `${Translator.translationDirectory}/${language}.json`
      );
    }
    return Translator.translations[language];
  }

  private static async getFileContents(filePath: string) {
    await new Promise((resolve, reject) => {
      fs.access(filePath, fs.constants.F_OK, err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });

    return JSON.parse(fs.readFileSync(filePath).toString());
  }

  constructor(private language: string) {}

  public async get(translationKeyPath: string, ...params: TranslatorParam[]) {
    const translations = await Translator.loadLanguage(this.language);

    let translation = translationKeyPath
      .split('.')
      .reduce((previous, current) => {
        return previous[current] || '';
      }, translations);

    translation = this.replaceTags(translation, params);

    return translation || translationKeyPath;
  }

  private replaceTags(translation: string, params: TranslatorParam[]) {
    return params.reduce(
      (previous, param) => previous.replace(`{${param.key}}`, param.value),
      translation
    );
  }
}
export default Translator;
