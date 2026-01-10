import { FolderCode } from "lucide-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function EmptyContent() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FolderCode />
          </EmptyMedia>
          <EmptyTitle>No Content Yet</EmptyTitle>
          <EmptyDescription>
            You haven&apos;t Enable Feature Flag on this project. Get started by
            enabling some features.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
