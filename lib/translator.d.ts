import TranslatorParam from './translatorParam';
declare class Translator {
    private language;
    static initialize(translationDirectory: string, languagesToLoadUpfront?: string[]): Promise<void>;
    private static translations;
    private static translationDirectory;
    private static loadLanguage;
    private static getFileContents;
    constructor(language: string);
    get(translationKeyPath: string, ...params: TranslatorParam[]): Promise<any>;
    private replaceTags;
}
export default Translator;
