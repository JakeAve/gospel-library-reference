export function determineTextType(
  input: string,
): "reference" | "query" {
  return input.match(/\b[a-zA-Z]+\s+[a-zA-Z]+\s+[a-zA-Z]+\s+[a-zA-Z]+\b/g)
    ? "query"
    : "reference";
}
