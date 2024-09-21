export function camelCaseToTitleCase(input: string): string {
  // Use a regular expression to insert a space before each uppercase letter
  const spacedString = input.replace(/([a-z])([A-Z])/g, '$1 $2');
  
  // Capitalize the first character of each word
  const capitalizedString = spacedString.replace(/\b\w/g, char => char.toUpperCase());
  
  return capitalizedString;
}