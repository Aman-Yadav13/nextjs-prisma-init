import { LayoutList, SquareTerminal } from "lucide-react";

export const NavData = {
  navMain: [
    {
      title: "Dashboard",
      url: "/u/dashboard",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Catalogue",
      icon: LayoutList,
      items: [
        {
          title: "Environments",
          url: "/u/catalogue/environments",
          items: [
            {
              title: "Internal",
              url: "/u/catalogue/environments/internal",
            },
            {
              title: "Customer",
              url: "/u/catalogue/environments/customer",
              items: [
                {
                  title: "Prod",
                  url: "/u/catalogue/environments/customer/prod",
                },
                {
                  title: "Non-Prod",
                  url: "/u/catalogue/environments/customer/non-prod",
                },
              ],
            },
          ],
        },
        {
          title: "Services",
          url: "/u/catalogue/services",
        },
      ],
    },
  ],
};
