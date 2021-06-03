import { Button, IconButton, Popover } from "@material-ui/core";
import PopupState, { bindPopover, bindTrigger } from "material-ui-popup-state";

export default function PopupButton({ text, title, children }) {
    return(
        <PopupState variant="popover" popupId="login-popup">
            {
                popupState =>
                    <div>
                        {
                            typeof text === "string"
                            ?
                            <Button {...bindTrigger(popupState)} title={title}>
                                {text}
                            </Button>
                            :
                            <IconButton {...bindTrigger(popupState)} title={title}>
                                {text}
                            </IconButton>
                        }
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