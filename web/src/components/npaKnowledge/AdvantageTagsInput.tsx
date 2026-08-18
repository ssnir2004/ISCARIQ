import { ADVANTAGE_SUGGESTIONS } from "../../lib/npaKnowledgeConstants";
import { TagInput } from "./TagInput";

export function AdvantageTagsInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  return <TagInput value={value} onChange={onChange} suggestions={ADVANTAGE_SUGGESTIONS} placeholder="e.g. Better chip evacuation" />;
}
