import type { ProposalSection } from "@/types/proposal";

export const visibleSections = (sections: ProposalSection[]) => sections.filter((section) => section.enabled);