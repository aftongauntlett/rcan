export const PRIORITY_OPTIONS = [
  { value: "No Rush (1 week)", label: "No Rush (1 week)" },
  { value: "Rush (a few days)", label: "Rush (a few days)" },
  {
    value: "Urgent (ASAP, today if possible)",
    label: "Urgent (ASAP, today if possible)",
  },
];

export const PAGE_GROUP_OPTIONS = [
  { value: "pages", label: "Pages", description: "Update content on a specific page" },
  {
    value: "whole-site",
    label: "Site",
    description: "Request sitewide changes, like the navbar or footer",
  },
  { value: "other", label: "Other", description: "Add, remove, or edit a page" },
  {
    value: "technical",
    label: "Technical / Bug Report",
    description: "Report a bug, broken link, or something not working",
  },
];

export const PAGE_SECTIONS: Record<string, string[]> = {
  Home: [
    "Hero / About RCAN",
    "2025 impact stats",
    "How RCAN assists",
    "How you can help",
    "Stand with returning citizens CTA",
  ],
  "Who We Are": [
    "Page Header",
    "Board of Directors",
    "Participating congregations",
    "Congregation CTA",
  ],
  "How We Help": [
    "Page Header",
    "Support pathway",
    "Emergency Assistance",
    "Prison Friendship Project",
    "Bike Ministry",
    "Beauty Behind Bars",
    "Holiday Gifts",
    "Response network CTA",
  ],
  "Get Involved": ["Page Header", "Ways to help", "Congregation commitments", "Ready to help CTA"],
  Impact: ["Page Header", "2025 by the numbers", "Client Stories", "Impact CTA"],
  Donate: [
    "Page Header",
    "Give to RCAN",
    "Donorbox donation form",
    "Mail giving",
    "What your gift supports",
  ],
  Contact: ["Page Header", "Contact Methods", "Contact Form"],
  About: ["Page Header", "Our History", "Our Motivation", "Our Approach"],
  "Header / Navigation": ["Main menu", "Logo", "Mobile menu", "Call-to-action button", "Other"],
  Footer: ["Contact info", "Navigation links", "Donate / CTA", "Copyright / legal", "Other"],
  Sitewide: ["Colors / styling", "Accessibility", "SEO / search preview", "Images", "Other"],
  "Request to remove a page": [
    "Home",
    "Who We Are",
    "How We Help",
    "Get Involved",
    "Impact",
    "Donate",
    "Contact",
    "About",
  ],
  "Request to edit a page": [
    "Home",
    "Who We Are",
    "How We Help",
    "Get Involved",
    "Impact",
    "Donate",
    "Contact",
    "About",
  ],
};

export const PAGE_GROUPS_DATA = [
  {
    key: "pages",
    label: "Pages",
    pages: [
      "Home",
      "Who We Are",
      "How We Help",
      "Get Involved",
      "Impact",
      "Donate",
      "Contact",
      "About",
    ],
    cols: "grid-cols-2 sm:grid-cols-4",
  },
  {
    key: "whole-site",
    label: "Site",
    pages: ["Header / Navigation", "Footer", "Sitewide"],
    cols: "grid-cols-2 sm:grid-cols-3",
  },
  {
    key: "other",
    label: "Other",
    pages: ["Request to add a page", "Request to remove a page", "Request to edit a page"],
    cols: "grid-cols-1 sm:grid-cols-3",
  },
  {
    key: "technical",
    label: "Technical / Bug Report",
    pages: [],
    cols: "grid-cols-1",
  },
];

export type ChangeRequestStatus = "New" | "In progress" | "Waiting for info" | "Complete";

export interface ChangeRequest {
  id: string;
  requester: string;
  submitted: string;
  priority: string;
  status: ChangeRequestStatus;
  note: string;
  changes: {
    page: string;
    section: string;
    description: string;
  }[];
}

export const getPriorityChipClass = (priority: string, status: ChangeRequestStatus): string => {
  if (status !== "In progress") return "bg-neutral-200 text-text-subtle";
  if (priority.startsWith("Urgent")) return "bg-status-errorBg text-status-error";
  if (priority.startsWith("Rush")) return "bg-status-warningBg text-status-warning";
  if (priority.startsWith("No Rush")) return "bg-status-successBg text-status-success";
  return "bg-neutral-200 text-text-subtle";
};

// Manually maintained from Formspree email notifications pasted into Codex.
// Notes and statuses render on the admin page for all logged-in users.
export const CHANGE_REQUESTS: ChangeRequest[] = [
  {
    id: "2026-07-07-content-updates",
    requester: "Theo",
    submitted: "July 7, 2026",
    priority: "Urgent (ASAP, today if possible)",
    status: "Complete",
    note: "Batch of content corrections and copy updates from Theo.",
    changes: [
      {
        page: "Who We Are",
        section: "RCAN / PDS group photo",
        description: 'Update photo caption from "RCAN leaders" to "RCAN volunteers".',
      },
      {
        page: "Who We Are",
        section: "Board of Directors",
        description: 'Update "Laura Cohen" to "Laura Beth Cohen".',
      },
      {
        page: "Header / Navigation",
        section: "Logo",
        description: "Make the navbar logo a bit larger.",
      },
      {
        page: "About",
        section: "Our Motivation",
        description: "Move the Proverbs and Micah scripture quotes to the top of the list.",
      },
      {
        page: "How We Help",
        section: "Support pathway",
        description:
          'Remove the line "Most weeks, RCAN coordinates one to two urgent requests through the network." and fold it into the top paragraph as "RCAN usually receives 2-3 urgent requests each week."',
      },
      {
        page: "Donate",
        section: "Mail giving",
        description:
          "Replace the NYAPC/gift paragraph with new copy about how gifts help fund urgent requests and 2025 impact (361 PDS clients and family members assisted), holiday gifts, and commissary contributions. Keep the closing sentence about Donorbox.",
      },
    ],
  },
  {
    id: "2026-07-03-hero-image",
    requester: "Theo",
    submitted: "July 3, 2026",
    priority: "Urgent (ASAP, today if possible)",
    status: "Complete",
    note: "Replaced hero image with a new photo.",
    changes: [
      {
        page: "Home",
        section: "Hero / About RCAN",
        description: "Update the hero image.",
      },
    ],
  },
  {
    id: "2026-07-03-donorbox-launch",
    requester: "Afton - Developer",
    submitted: "July 3, 2026",
    priority: "Rush (a few days)",
    status: "In progress",
    note: "Launch coordination is in progress. The client will complete Donorbox payment setup, and the developer will handle DNS updates once the donation flow is ready.",
    changes: [
      {
        page: "Donate",
        section: "Donorbox setup",
        description:
          "Client to complete Donorbox setup, including connecting Square or PayPal so donations can be processed through the live site.",
      },
      {
        page: "Website",
        section: "Launch and DNS",
        description:
          "Developer to update the Wix DNS records to point the domain to Vercel, then launch the site once the donation setup is complete.",
      },
    ],
  },
  {
    id: "2026-07-02-board-who-we-are",
    requester: "Theo",
    submitted: "July 2, 2026",
    priority: "Urgent (ASAP, today if possible)",
    status: "Complete",
    note: "Board list and introductory language have been provided. Photos and bios can be added later when available.",
    changes: [
      {
        page: "Who We Are",
        section: "Board of Directors",
        description:
          "Add a Board of Directors section using the provided list and short introductory sentence. For now, list board members without photos or bios.",
      },
      {
        page: "Who We Are",
        section: "RCAN / PDS group photo",
        description:
          "Use the provided group photo of RCAN volunteers and PDS staff together at a holiday party. Place it where it best fits on the Who We Are page.",
      },
      {
        page: "Contact",
        section: "Contact Methods",
        description: "Update the contact page phone number using the number Theo provided.",
      },
    ],
  },
  {
    id: "2026-07-01-website-photos",
    requester: "Theo",
    submitted: "July 1, 2026",
    priority: "Rush (a few days)",
    status: "Complete",
    note: "Use the strongest available images where they support the page content. Avoid adding photos where they make sections feel crowded.",
    changes: [
      {
        page: "Who We Are",
        section: "RCAN / PDS group photo",
        description:
          'Add the large group photo of RCAN leaders and PDS staff with a caption along the lines of "RCAN leaders and PDS staff together at a Christmas party in 2025."',
      },
      {
        page: "How We Help",
        section: "Bike Ministry",
        description:
          "Use one or two provided bike ministry photos if they fit the layout. If space is limited, choose the stronger image.",
      },
    ],
  },
  {
    id: "2026-07-01-how-we-help-rewrites",
    requester: "Theo",
    submitted: "July 1, 2026",
    priority: "No Rush (1 week)",
    status: "Complete",
    note: "Theo provided revised page copy for multiple How We Help sections.",
    changes: [
      {
        page: "How We Help",
        section: "Emergency Assistance",
        description: "Add the new Emergency Assistance section using the provided copy.",
      },
      {
        page: "How We Help",
        section: "Bike Ministry",
        description: "Update the Bike Ministry section using the revised copy.",
      },
      {
        page: "How We Help",
        section: "Holiday Gifts",
        description:
          "Create a new Holiday Gifts category using the provided language and related Youth Center updates.",
      },
      {
        page: "How We Help",
        section: "Page structure",
        description:
          "Reorder the How We Help sections and remove the Holiday Fun section at the bottom. Reuse one or two suitable existing holiday images if they fit.",
      },
    ],
  },
  {
    id: "2026-06-23-25-site-planning",
    requester: "Theo",
    submitted: "June 23-25, 2026",
    priority: "No Rush (1 week)",
    status: "Complete",
    note: "Initial planning and platform direction are archived here for project history.",
    changes: [
      {
        page: "Donate",
        section: "Donation platform",
        description: "Discussed Donorbox setup and how donation flow should fit into the website.",
      },
      {
        page: "Website",
        section: "Platform and design planning",
        description:
          "Discussed Wix/platform considerations, initial design direction, and overall site planning.",
      },
    ],
  },
];
