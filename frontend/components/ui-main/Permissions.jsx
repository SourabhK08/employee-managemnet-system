"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { groupByModule } from "@/utils/groupPermissionsByModule";

export function PermissionsAccordionWithCheckbox({ permissions, onChange }) {
  const grouped = groupByModule(permissions);
  const [selected, setSelected] = useState([]);

  const handleToggle = (permKey) => {
    let updated = [];
    if (selected.includes(permKey)) {
      updated = selected.filter((key) => key !== permKey);
    } else {
      updated = [...selected, permKey];
    }
    setSelected(updated);
    onChange(updated);
  };

  return (
    <Accordion type="multiple" className="w-full">
      {Object.entries(grouped).map(([module, perms]) => (
        <AccordionItem key={module} value={module}>
          <AccordionTrigger>
            {module.replace(/_/g, " ").toUpperCase()}
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 pl-4">
              {perms.map((perm) => (
                <label key={perm.key} className="flex items-center gap-2">
                  <Checkbox
                    id={perm.key}
                    checked={selected.includes(perm.key)}
                    onCheckedChange={() => handleToggle(perm.key)}
                  />
                  <span className="capitalize">
                    {perm.value.replace(/-/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
