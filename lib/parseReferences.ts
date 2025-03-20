export function parseReferences(input: string) {
  input = input.trim();

  return input.split(/;/).map((r) => r.trim());
}
