import { createMuiTheme } from "@material-ui/core"
import { cyan, grey, teal } from "@material-ui/core/colors"
import { createContext, useState } from "react"

const primary = {
  main: teal["A700"]
}

const secondary = {
  main: cyan[900]
}

const lightTheme = createMuiTheme(
  {
    palette: {
      type: "light",
      primary,
      secondary
    },
  }
)

const darkTheme = createMuiTheme(
  {
    palette: {
      type: "dark",
      primary,
      secondary,
      background: {
        default: grey[900],
        paper: grey["A400"]
      }
    }
  }
)

const reverse = {
  light: darkTheme,
  dark: lightTheme
}

const ThemeContext = createContext()

const ThemeProvider = ({ children }) => {

    const [theme, setTheme] = useState(
      (
        (typeof localStorage !== "undefined" && localStorage.getItem("theme") === "light")
        ||
        (typeof window !== "undefined" && window.matchMedia('(prefers-color-scheme: light)').matches)
      ) 
      ? lightTheme 
      : darkTheme
    )

    const toggleTheme = () => {
      setTheme(reverse[theme.palette.type])
      if (typeof localStorage !== "undefined")
        localStorage.setItem("theme", reverse[theme.palette.type].palette.type)
    }

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeProvider, ThemeContext }