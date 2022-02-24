export type SessionTopicLabelProps = {
  name: string;
};

const COLOURS = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "teal",
  "violet",
  "rose",
];

/**
 * Converts a name string into a possible colour.
 * We do this to keep the colours consistent for all topics of the same name.
 * Its calculated just by summing all the values of the characters inside the string modulo the number of possible colours
 * @param name The name to convert into a colour
 * @returns A colour text
 */
const colourFromName = (name: string) => {
  const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = sum % COLOURS.length;
  return COLOURS[index];
};

export default function SessionTopicLabel({ name }: SessionTopicLabelProps) {
  const colour = colourFromName(name.toString());
  return (
    <span className={`px-4 rounded-lg bg-${colour}-300 bg-opacity-90`}>
      {name}
    </span>
  );
}
