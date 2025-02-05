"use client"
import * as React from "react"
import {
  BookOpen,
  Bot,
  Frame,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "../components/nav-main"
import { NavProjects } from "../components/nav-projects"
import { NavUser } from "../components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "../components/ui/sidebar"
// This is sample data.
const data = {
  navMain: [
    {
      title: "Analizler",
      url: "#Analizler",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Panel",
          url: "#analizler/panel",
        },
        {
          title: "İstatistikler",
          url: "#analizler/istatistikler",
        },
        {
          title: "Envanter",
          url: "#analizler/envanter",
        },
      ],
    },
    {
      title: "SKT Takip",
      url: "#SKT Takip",
      icon: Bot,
      items: [
        {
          title: "Depo SKT",
          url: "#skttakip/deposkt",
        },
        {
          title: "Bar SKT",
          url: "#skttakip/barskt",
        },
      ],
    },
    {
      title: "Dökümanlar",
      url: "#Dökümanlar",
      icon: BookOpen,
      items: [
        {
          title: "Görev Çizelgesi",
          url: "#dokumanlar/gorevcizelgesi",
        },
        {
          title: "Haftalık Shift",
          url: "#dokumanlar/haftalikshift",
        },
        {
          title: "Envanter",
          url: "#dokumanlar/envanter",
        },
        {
          title: "Raporlar",
          url: "#dokumanlar/raporlar",
        },
      ],
    },
    {
      title: "Ayarlar",
      url: "#Ayarlar",
      icon: Settings2,
      items: [
        {
          title: "Genel",
          url: "#ayarlar/genel",
        },
        {
          title: "Ekip",
          url: "#ayarlar/ekip",
        },
        {
          title: "Hesap Kaydı",
          url: "#ayarlar/hesapkaydi",
        },
      ],
    },
  ],
  Projeler: [
    {
      name: "Ekip Çalışması",
      url: "/panel",
      icon: Frame,
    },
    {
      name: "İş Planı",
      url: "/panel",
      icon: PieChart,
    },
    {
      name: "Eğitim",
      url: "/panel",
      icon: BookOpen,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.Projeler} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser/>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
