const COLOURS = [
  "bg-red-300",
  "bg-orange-300",
  "bg-yellow-300",
  "bg-green-300",
  "bg-blue-300",
  "bg-teal-300",
  "bg-violet-300",
  "bg-rose-300",
];

/**
 * Converts a name string into a possible colour.
 * We do this to keep the colours consistent for all topics of the same name.
 * Its calculated just by summing all the values of the characters inside the string modulo the number of possible colours
 * @param name The name to convert into a colour
 * @returns A colour text
 */
export const colourFromName = (name: string) => {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = sum % COLOURS.length;
  return COLOURS[index];
};
