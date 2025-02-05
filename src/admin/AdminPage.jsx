import { useState, useEffect } from "react";
import { AppSidebar } from "../components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";
import { Button } from "../components/ui/button";

// Pages
import AdminPanel from "./pages/AdminPanel";
import BarSkt from "../page/skt/barskt";

import { ubgidadark } from "../assets";

export default function Page() {
  const [activePage, setActivePage] = useState(window.location.hash || "#panel");
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(window.location.hash);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  // Dark mode değiştiğinde, class ve localStorage güncelle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#analizler/panel">Anasayfa</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Veri İşlemleri</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          {/* Dark Mode Toggle */}
          <Button onClick={() => setDarkMode(!darkMode)} variant="outline">
            {darkMode ? "🌞 Aydınlık Mod" : "🌙 Karanlık Mod"}
          </Button>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {activePage === "#analizler/panel" && <AdminPanel />}
          {activePage === "#analizler/istatistikler" && <div>İstatistikler Paneli</div>}
          {activePage === "#analizler/envanter" && <div>Envanter Paneli</div>}
          {activePage === "#skttakip/deposkt" && <div>Depo SKT Paneli</div>}
          {activePage === "#skttakip/barskt" && <BarSkt />}
          {activePage === "#dokumanlar/gorevcizelgesi" && <div>Görev Çizelgesi</div>}
          {activePage === "#dokumanlar/haftalikshift" && <div>Haftalık Shift Paneli</div>}
          {activePage === "#dokumanlar/envanter" && <div>Envanter</div>}
          {activePage === "#dokumanlar/raporlar" && <div>Raporlar</div>}
          {activePage === "#ayarlar/genel" && <div>genel Paneli</div>}
          {activePage === "#ayarlar/ekip" && <div>ekip Paneli</div>}
          {activePage === "#ayarlar/hesapkaydi" && <div>Hesap Kaydı</div>}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
