import type { ReactNode } from "react";

import { LearningPageHeader } from "@/components/shared/learning-page-header";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <LearningPageHeader eyebrow={eyebrow} title={title} description={description}>
      {children}
    </LearningPageHeader>
  );
}
