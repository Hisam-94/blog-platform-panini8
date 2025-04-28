// import React, { ButtonHTMLAttributes } from "react";
// import styled, { css } from "styled-components";

// type ButtonVariant =
//   | "primary"
//   | "secondary"
//   | "outline"
//   | "danger"
//   | "text"
//   | "gradient-blue"
//   | "gradient-green"
//   | "gradient-purple"
//   | "gradient-orange";
// type ButtonSize = "small" | "medium" | "large";

// interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
//   variant?: ButtonVariant;
//   size?: ButtonSize;
//   fullWidth?: boolean;
//   isLoading?: boolean;
// }

// const getButtonStyles = (variant: ButtonVariant = "primary", theme: any) => {
//   const styles = {
//     primary: css`
//       background-color: ${theme.colors.primary};
//       color: white;
//       border: none;
//       box-shadow: ${theme.shadows.sm};
//       font-weight: ${theme.fontWeights.medium};

//       &:hover {
//         box-shadow: ${theme.shadows.md};
//         transform: translateY(-2px);
//       }
//     `,
//     secondary: css`
//       background-color: ${theme.colors.secondary};
//       color: white;
//       border: none;
//       box-shadow: ${theme.shadows.sm};

//       &:hover {
//         box-shadow: ${theme.shadows.md};
//         transform: translateY(-2px);
//       }
//     `,
//     outline: css`
//       background-color: transparent;
//       color: ${theme.colors.primary};
//       border: 1px solid ${theme.colors.primary};

//       &:hover {
//         background-color: ${theme.colors.card};
//         border-color: ${theme.colors.secondary};
//         color: ${theme.colors.secondary};
//       }
//     `,
//     danger: css`
//       background-color: ${theme.colors.error};
//       color: white;
//       border: none;
//       box-shadow: ${theme.shadows.sm};

//       &:hover {
//         box-shadow: ${theme.shadows.md};
//         transform: translateY(-2px);
//       }
//     `,
//     text: css`
//       background-color: transparent;
//       color: ${theme.colors.primary};
//       border: none;
//       padding: 0;

//       &:hover {
//         color: ${theme.colors.secondary};
//         text-decoration: underline;
//       }
//     `,
//     "gradient-blue": css`
//       background: ${theme.colors.gradient.blue};
//       color: white;
//       border: none;
//       box-shadow: ${theme.shadows.sm};

//       &:hover {
//         box-shadow: ${theme.shadows.md};
//         transform: translateY(-2px);
//       }
//     `,
//     "gradient-green": css`
//       background: ${theme.colors.gradient.green};
//       color: white;
//       border: none;
//       box-shadow: ${theme.shadows.sm};

//       &:hover {
//         box-shadow: ${theme.shadows.md};
//         transform: translateY(-2px);
//       }
//     `,
//     "gradient-purple": css`
//       background: ${theme.colors.gradient.purple};
//       color: white;
//       border: none;
//       box-shadow: ${theme.shadows.sm};

//       &:hover {
//         box-shadow: ${theme.shadows.md};
//         transform: translateY(-2px);
//       }
//     `,
//     "gradient-orange": css`
//       background: ${theme.colors.gradient.orange};
//       color: white;
//       border: none;
//       box-shadow: ${theme.shadows.sm};
//       font-weight: ${theme.fontWeights.medium};

//       &:hover {
//         box-shadow: ${theme.shadows.md};
//         transform: translateY(-2px);
//       }
//     `,
//   };

//   return styles[variant];
// };

// const getButtonSize = (size: ButtonSize = "medium", theme: any) => {
//   const sizes = {
//     small: css`
//       font-size: ${theme.fontSizes.sm};
//       padding: ${theme.space.xs} ${theme.space.sm};
//     `,
//     medium: css`
//       font-size: ${theme.fontSizes.md};
//       padding: ${theme.space.sm} ${theme.space.md};
//     `,
//     large: css`
//       font-size: ${theme.fontSizes.lg};
//       padding: ${theme.space.md} ${theme.space.lg};
//     `,
//   };

//   return sizes[size];
// };

// const StyledButton = styled.button<ButtonProps>`
//   display: inline-flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: ${({ theme }) => theme.fontWeights.medium};
//   border-radius: ${({ theme }) => theme.radii.full};
//   transition: all ${({ theme }) => theme.transitions.fast};
//   cursor: pointer;

//   ${({ variant, theme }) => getButtonStyles(variant, theme)}
//   ${({ size, theme }) => getButtonSize(size, theme)}
  
//   ${({ fullWidth }) =>
//     fullWidth &&
//     css`
//       width: 100%;
//     `}
  
//   ${({ isLoading }) =>
//     isLoading &&
//     css`
//       opacity: 0.7;
//       cursor: not-allowed;
//       position: relative;

//       &::after {
//         content: "";
//         position: absolute;
//         width: 16px;
//         height: 16px;
//         border: 2px solid rgba(255, 255, 255, 0.3);
//         border-top-color: white;
//         border-radius: 50%;
//         animation: spin 1s linear infinite;
//       }

//       @keyframes spin {
//         to {
//           transform: rotate(360deg);
//         }
//       }
//     `}
  
//   &:disabled {
//     opacity: 0.5;
//     cursor: not-allowed;
//   }
// `;

// const Button: React.FC<ButtonProps> = ({
//   children,
//   variant = "primary",
//   size = "medium",
//   fullWidth = false,
//   isLoading = false,
//   ...props
// }) => {
//   // Use gradient-blue as default for primary buttons to match Panini8 style
//   let finalVariant = variant;
//   if (variant === "primary") {
//     finalVariant = "gradient-blue";
//   } else if (variant === "secondary") {
//     finalVariant = "gradient-green";
//   }

//   return (
//     <StyledButton
//       variant={finalVariant}
//       size={size}
//       fullWidth={fullWidth}
//       isLoading={isLoading}
//       disabled={isLoading || props.disabled}
//       {...props}>
//       {isLoading ? (
//         <span style={{ visibility: "hidden" }}>{children}</span>
//       ) : (
//         children
//       )}
//     </StyledButton>
//   );
// };

// export default Button;


import { 
  ElementType, 
  ComponentPropsWithoutRef, 
  forwardRef,
  ReactNode 
} from "react";
import styled, { css, useTheme } from "styled-components";

type MergeElementProps<T extends ElementType> = 
  ButtonBaseProps & 
  ComponentPropsWithoutRef<T> & {
    as?: T;
    children?: ReactNode;
  };

  type ButtonProps<T extends ElementType = "button"> = MergeElementProps<T>;


type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "danger"
  | "text"
  | "gradient-blue"
  | "gradient-green"
  | "gradient-purple"
  | "gradient-orange";

type ButtonSize = "small" | "medium" | "large";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  as?: ElementType;
}

// type ButtonProps<T extends ElementType = "button"> = ButtonBaseProps &
//   ComponentPropsWithoutRef<T>;

const getButtonStyles = (variant: ButtonVariant = "primary", theme: any) => {
  const styles = {
    primary: css`
      background-color: ${theme.colors.primary};
      color: white;
      border: none;
      box-shadow: ${theme.shadows.sm};
      font-weight: ${theme.fontWeights.medium};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `,
    // ... keep all other variant styles unchanged
    secondary: css`
      background-color: ${theme.colors.secondary};
      color: white;
      border: none;
      box-shadow: ${theme.shadows.sm};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `,
    outline: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: 1px solid ${theme.colors.primary};

      &:hover {
        background-color: ${theme.colors.card};
        border-color: ${theme.colors.secondary};
        color: ${theme.colors.secondary};
      }
    `,
    danger: css`
      background-color: ${theme.colors.error};
      color: white;
      border: none;
      box-shadow: ${theme.shadows.sm};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `,
    text: css`
      background-color: transparent;
      color: ${theme.colors.primary};
      border: none;
      padding: 0;

      &:hover {
        color: ${theme.colors.secondary};
        text-decoration: underline;
      }
    `,
    "gradient-blue": css`
      background: ${theme.colors.gradient.blue};
      color: white;
      border: none;
      box-shadow: ${theme.shadows.sm};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `,
    "gradient-green": css`
      background: ${theme.colors.gradient.green};
      color: white;
      border: none;
      box-shadow: ${theme.shadows.sm};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `,
    "gradient-purple": css`
      background: ${theme.colors.gradient.purple};
      color: white;
      border: none;
      box-shadow: ${theme.shadows.sm};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `,
    "gradient-orange": css`
      background: ${theme.colors.gradient.orange};
      color: white;
      border: none;
      box-shadow: ${theme.shadows.sm};
      font-weight: ${theme.fontWeights.medium};

      &:hover {
        box-shadow: ${theme.shadows.md};
        transform: translateY(-2px);
      }
    `,
  };

  return styles[variant];
};

const getButtonSize = (size: ButtonSize = "medium", theme: any) => {
  const sizes = {
    small: css`
      font-size: ${theme.fontSizes.sm};
      padding: ${theme.space.xs} ${theme.space.sm};
    `,
    medium: css`
      font-size: ${theme.fontSizes.md};
      padding: ${theme.space.sm} ${theme.space.md};
    `,
    large: css`
      font-size: ${theme.fontSizes.lg};
      padding: ${theme.space.md} ${theme.space.lg};
    `,
  };

  return sizes[size];
};

const StyledButton = styled.button.attrs<ButtonBaseProps>(props => ({
  as: props.as || "button"
}))<ButtonBaseProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  transition: all ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  text-decoration: none;

  ${({ variant, theme }) => getButtonStyles(variant, theme)}
  ${({ size, theme }) => getButtonSize(size, theme)}
  
  ${({ fullWidth }) =>
    fullWidth &&
    css`
      width: 100%;
    `}
  
  ${({ isLoading }) =>
    isLoading &&
    css`
      opacity: 0.7;
      cursor: not-allowed;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// const Button = forwardRef<HTMLElement, ButtonProps>(
//   (
//     {
//       children,
//       variant = "primary",
//       size = "medium",
//       fullWidth = false,
//       isLoading = false,
//       as = "button" as ElementType,
//       ...props
//     },
//     ref
//   ) => {
//     const theme = useTheme();
    
//     // Handle gradient variants
//     let finalVariant = variant;
//     if (variant === "primary") finalVariant = "gradient-blue";
//     if (variant === "secondary") finalVariant = "gradient-green";

//     return (
//       <StyledButton
//         ref={ref}
//         as={as}
//         variant={finalVariant}
//         size={size}
//         fullWidth={fullWidth}
//         isLoading={isLoading}
//         disabled={isLoading || props.disabled}
//         theme={theme}
//         {...props}
//       >
//         {isLoading ? (
//           <span style={{ visibility: "hidden" }}>{children}</span>
//         ) : (
//           children
//         )}
//       </StyledButton>
//     );
//   }
// )as <T extends ElementType = "button">(
//   props: ButtonProps<T> & { ref?: React.ForwardedRef<HTMLElement> }
// ) => React.ReactElement;

// Button.displayName = "Button";

// export default Button;

const ButtonWithRef = forwardRef<HTMLElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      isLoading = false,
      as = "button" as ElementType,
      ...props
    },
    ref
  ) => {
    const theme = useTheme();
    
    let finalVariant = variant;
    if (variant === "primary") finalVariant = "gradient-blue";
    if (variant === "secondary") finalVariant = "gradient-green";

    return (
      <StyledButton
        ref={ref}
        as={as}
        variant={finalVariant}
        size={size}
        fullWidth={fullWidth}
        isLoading={isLoading}
        disabled={isLoading || props.disabled}
        theme={theme}
        {...props}
      >
        {isLoading ? (
          <span style={{ visibility: "hidden" }}>{children}</span>
        ) : (
          children
        )}
      </StyledButton>
    );
  }
);

const Button = Object.assign(
  ButtonWithRef as <T extends ElementType = "button">(
    props: ButtonProps<T> & { ref?: React.ForwardedRef<HTMLElement> }
  ) => React.ReactElement,
  { displayName: "Button" }
);

export default Button;
