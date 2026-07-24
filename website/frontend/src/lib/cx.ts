export function cx(...classNames: (string | undefined | false)[]): string {
  return classNames.filter(Boolean).join(" ");
}
