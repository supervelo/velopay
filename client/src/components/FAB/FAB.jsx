import { useState } from "react";
import cn from "classnames";
import { MdElectricBolt } from "react-icons/md";

import "./styles.scss";

const FAB = ({ actions }) => {
  const [open, setOpen] = useState(true);

  const mouseEnter = () => setOpen(true);

  const mouseLeave = () => setOpen(false);

  return (
    <ul
      className={cn("fab-container", { open })}
      onMouseEnter={mouseEnter}
      onMouseLeave={mouseLeave}
    >

      <li className="fab-button">
        <MdElectricBolt />
      </li>

      {actions.map((action, index) => (
        <li
          style={{ transitionDelay: `${index * 25}ms` }}
          className={cn("fab-action", { open })}
          key={action.label}
          onClick={action.onClick}
        >
          {action.icon}
          <span className="tooltip">{action.label}</span>
        </li>
      ))}
    </ul>
  );
};

export default FAB;
