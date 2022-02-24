import { colourFromName } from "../utils/colours";

export type SessionTopicLabelProps = {
  name: string;
};

export default function SessionTopicLabel({ name }: SessionTopicLabelProps) {
  const colour = colourFromName(name.toString());
  return (
    <span className={`px-4 rounded-lg ${colour} bg-opacity-90`}>{name}</span>
  );
}
