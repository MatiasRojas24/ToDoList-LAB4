import { useState } from "react";
import styles from "./Dropdown.module.css";
import { ISprint } from "../../../types/ISprint";

interface DropdownProps {
  sprints: ISprint[];
  onSelectSprint: (id: string) => void;
}

const Dropdown = ({ sprints, onSelectSprint }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSprint, setSelectedSprint] = useState<ISprint | null>(null);

  const handleSelect = (sprint: ISprint) => {
    onSelectSprint(sprint.id!);
    setSelectedSprint(sprint);
    setIsOpen(false);
  };

  return (
    <div className={styles.dropdown}>
      <button
        className={styles.dropdownToggle}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedSprint ? selectedSprint.nombre : "Seleccione una Sprint"} ▼
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {sprints.map((sprint) => (
            <button
              key={sprint.id}
              className={styles.dropdownItem}
              onClick={() => handleSelect(sprint)}
            >
              {sprint.nombre}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;