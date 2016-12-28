import config from '../config';

export default
function transformTemplate(source: string): string {
  for (const key in config) {
    source = source.replace(new RegExp(`\{\{\{${key}\}\}\}`, 'g'), config[key]);
  }
  return source.replace(/\{\{\{APP\}\}\}/g, this.app);
}
