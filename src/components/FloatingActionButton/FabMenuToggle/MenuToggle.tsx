import { useState } from "react";
import NovartisLogo from "../../assets/novartis.png";
import "./MenuToggleStyles.css";
import NovartisFull from "../../assets/novartis-logo-out.png";

export const MenuToggle = ({ toggle }: any) => {
  const [toggled, SetToggled] = useState(false);
  const clickLogo = () =>{
    SetToggled(!toggled)
    toggle()
  }
  return (
    <button onClick={clickLogo} className="fab-button">
      <div
        // className={
        //   disabled
        //     ? "floating-action-button-disabled"
        //     : visibility
        //     ? "floating-action-button-open"
        //     : "floating-action-button"
        // }
        // onClick={disabled ? undefined : onClick}
        className={toggled ? "btnImgDivFull" : "btnImgDiv"}
      >
        {toggled ? (
          <img
            src={NovartisFull}
            alt="Custom Logo"
            className="Fab-logo-full"
          />
        ) : (
          <img
            src={NovartisLogo}
            alt="Custom Logo"
            className="floating-action-button-logo"
          />
        )}
      </div>
    </button>
  );
};
