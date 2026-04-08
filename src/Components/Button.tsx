import React, { type ReactNode } from 'react'

type ButtonTypes = "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link";

interface ButtonProps {
    buttonType: ButtonTypes,
    children: ReactNode,
    onClickEvent?: () => void,
    disabled?: false | true,
    outlineStyle?: false | true,
    HtmlType?: "button" | "submit" | "reset",
    className?: string,
    id?: string,
};

const Button = ({ buttonType, children, onClickEvent, disabled, outlineStyle, HtmlType, className, id }: ButtonProps) => {
    return (
        <button
            type={HtmlType}
            className={"btn btn-" + (outlineStyle ? "outline-" : "") + buttonType + " " + className}
            onClick={onClickEvent}
            disabled={disabled}
            id={id}
        >
            {children}
        </button>
    )
}

export default Button