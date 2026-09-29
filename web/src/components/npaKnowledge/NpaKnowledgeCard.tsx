import type { NpaKnowledgeItem } from "../../lib/types";
import { applicationLabel } from "../../lib/npaKnowledgeConstants";
import { Button, Card, Iso513Badge } from "../ui";

function openNpaFile(item: NpaKnowledgeItem) {
  if (!item.npaFileData) return;
  const win = window.open();
  if (win) {
    win.document.write(
      `<iframe src="${item.npaFileData}" style="border:0;position:fixed;inset:0;width:100%;height:100%"></iframe>`
    );
  } else {
    const a = document.createElement("a");
    a.href = item.npaFileData;
    a.download = item.npaFileName ?? "npa-file";
    a.click();
  }
}

export function NpaKnowledgeCard({
  item,
  onView,
  onEdit,
  onDelete,
}: {
  item: NpaKnowledgeItem;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card className="flex gap-3 p-3">
      <button type="button" onClick={onView} className="shrink-0">
        {item.imageData ? (
          <img src={item.imageData} alt="" className="h-20 w-20 rounded-lg object-cover" />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-neutral-100 text-xs text-neutral-400 dark:bg-neutral-800">
            No image
          </div>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <button type="button" onClick={onView} className="text-left">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-xs dark:bg-neutral-800">{item.npaNumber}</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span>{item.productFamily}{item.subFamily ? ` / ${item.subFamily}` : ""}</span>
            {item.insertDesignation && <span className="font-mono">{item.insertDesignation}</span>}
            <span>{applicationLabel(item.applicationCategory)}</span>
            <span className="flex gap-1">
              {item.iso513Groups.map((g) => (
                <Iso513Badge key={g} group={g} />
              ))}
            </span>
          </div>
          {item.advantages.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {item.advantages.slice(0, 4).map((a) => (
                <span key={a} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  {a}
                </span>
              ))}
              {item.advantages.length > 4 && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">+{item.advantages.length - 4} more</span>
              )}
            </div>
          )}
          {item.recommendedUse && (
            <p className="mt-1 line-clamp-2 text-xs text-neutral-600 dark:text-neutral-300">{item.recommendedUse}</p>
          )}
        </button>
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        <Button variant="ghost" onClick={onView}>
          View
        </Button>
        <Button variant="ghost" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" onClick={onDelete}>
          Delete
        </Button>
        {item.npaFileData && (
          <Button variant="ghost" onClick={() => openNpaFile(item)}>
            Open NPA
          </Button>
        )}
      </div>
    </Card>
  );
}

export { openNpaFile };
