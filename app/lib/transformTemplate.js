export default
function transformTemplate(source: string): string {
  return source.replace(/\{app\}/g, this.app);
}
