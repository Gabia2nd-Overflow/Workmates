import { useEffect, useState } from "react";
import { EVENT_OPEN_CREATE_WORKSHOP } from "./uiBus";
import CreateWorkshopModal from "../CreateWorkshopModal";

export default function CreateWorkshopModalHost() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener(EVENT_OPEN_CREATE_WORKSHOP, handler);
    return () => window.removeEventListener(EVENT_OPEN_CREATE_WORKSHOP, handler);
  }, []);

  return <CreateWorkshopModal show={open} onClose={() => setOpen(false)} />;
}