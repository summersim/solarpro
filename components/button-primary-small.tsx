import type { NextPage } from "next";
import React, { useMemo, useState, CSSProperties, ReactNode } from "react";
import styles from "./button-primary-small.module.css";

type ButtonPrimarySmallType = {
  browseProducts?: ReactNode;
  dropdown?: ReactNode;
  buttonPrimarySmallBackgroundColor?: CSSProperties["backgroundColor"];
  buttonPrimarySmallWidth?: CSSProperties["width"];
  buttonPrimarySmallHeight?: CSSProperties["height"];
  buttonPrimarySmallJustifyContent?: CSSProperties["justifyContent"];
  buttonPrimarySmallPosition?: CSSProperties["position"];
  buttonPrimarySmallTop?: CSSProperties["top"];
  buttonPrimarySmallLeft?: CSSProperties["left"];
  browseProductsFontSize?: CSSProperties["fontSize"];
  browseProductsColor?: CSSProperties["color"];
  browseProductsFontWeight?: CSSProperties["fontWeight"];
  onClick?: () => void; // Add onClick prop
  onSelect?: (value: string) => void;
};

const ButtonPrimarySmall: NextPage<ButtonPrimarySmallType> = ({
  dropdown,
  buttonPrimarySmallBackgroundColor,
  buttonPrimarySmallWidth,
  buttonPrimarySmallHeight,
  buttonPrimarySmallJustifyContent,
  buttonPrimarySmallPosition,
  buttonPrimarySmallTop,
  buttonPrimarySmallLeft,
  browseProductsFontSize,
  browseProductsColor,
  browseProductsFontWeight,
  onClick,
  onSelect,
}) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Select");

  const buttonPrimarySmallStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: buttonPrimarySmallBackgroundColor,
      width: buttonPrimarySmallWidth,
      height: buttonPrimarySmallHeight,
      justifyContent: buttonPrimarySmallJustifyContent,
      position: buttonPrimarySmallPosition,
      top: buttonPrimarySmallTop,
      left: buttonPrimarySmallLeft,
    };
  }, [
    buttonPrimarySmallBackgroundColor,
    buttonPrimarySmallWidth,
    buttonPrimarySmallHeight,
    buttonPrimarySmallJustifyContent,
    buttonPrimarySmallPosition,
    buttonPrimarySmallTop,
    buttonPrimarySmallLeft,
  ]);

  const toggleDropdown = () => {
    console.log("Toggle Dropdown");
    setDropdownOpen(!isDropdownOpen);
  };
  


  return (
    <div className={styles.buttonPrimarySmall} style={buttonPrimarySmallStyle}>
      <div style={{ fontSize: browseProductsFontSize, color: browseProductsColor, fontWeight: browseProductsFontWeight }} onClick={toggleDropdown}>
        {selectedItem}
      </div>
      {isDropdownOpen && (
        <div className={styles.dropdownContent}>
          {/* Display either the browseProducts or the custom dropdown content */}
          {dropdown && React.isValidElement(dropdown) && (
            React.cloneElement(dropdown as React.ReactElement, {
            })
          )}
        </div>
      )}
    </div>
  );
};

export default ButtonPrimarySmall;