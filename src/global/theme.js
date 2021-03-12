import { createMuiTheme } from "@material-ui/core";
import { createContext, useState } from "react";

const lightTheme = createMuiTheme(
  {
    palette: {
      type: "light"
    }
  }
)

const darkTheme = createMuiTheme(
  {
    palette: {
      type: "dark"
    }
  }
)

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(
      (typeof window !== "undefined" && window.matchMedia('(prefers-color-scheme: light)').matches) ? lightTheme : darkTheme
    )

    const toggleTheme = () => {
        setTheme(theme.palette.type === 'dark' ? lightTheme : darkTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeProvider, ThemeContext }