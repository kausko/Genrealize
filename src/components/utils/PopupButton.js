import { Button, Popover } from "@material-ui/core";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";

export default function PopupButton({ text, children }) {
    return(
        <PopupState variant="popover" popupId="login-popup">
            {
                popupState =>
                    <div>
                        <Button {...bindTrigger(popupState)}>
                            {text}
                        </Button>
                        <Popover
                            {...bindPopover(popupState)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                        >
                            {children}
                        </Popover>
                    </div>
            }
        </PopupState>
    )
}