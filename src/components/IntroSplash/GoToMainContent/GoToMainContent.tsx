import { forwardRef } from "react";
import "./GoToMainContent.css";

export interface GoToMainContentProps {
  onClick: () => void;
  disabled?: boolean;
}

const GoToMainContent = forwardRef<HTMLButtonElement, GoToMainContentProps>(
  function GoToMainContent({ onClick, disabled = false }, ref) {
    return (
      <div className="go-to-main-content">
        <button
          ref={ref}
          className="go-to-main-content__button"
          type="button"
          onClick={onClick}
          disabled={disabled}
        >
          <span className="go-to-main-content__label">Enter the System →</span>
        </button>
      </div>
    );
  }
);

GoToMainContent.displayName = "GoToMainContent";

export default GoToMainContent;
