import { Badge } from "@/components/ui/badge";
import type { CourseStatus } from "@/lib/mock-data";

export function CourseStatusBadge({ status }: { status: CourseStatus }) {
  return (
    <Badge variant={status === "PUBLISHED" ? "success" : "neutral"}>
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </Badge>
  );
}
