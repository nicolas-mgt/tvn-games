import { useEffect, useState } from 'react'

type Theme = 'system' | 'light' | 'dark'
const THEME_KEY = 'tvn-games:theme'

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(THEME_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  })

  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => {
      const dark = theme === 'dark' || (theme === 'system' && system.matches)
      document.documentElement.classList.toggle('dark', dark)
      document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
    }
    apply()
    system.addEventListener('change', apply)
    return () => system.removeEventListener('change', apply)
  }, [theme])

  return (
    <label className="flex shrink-0 items-center gap-2 text-sm text-muted-foreground">
      Motyw
      <select
        value={theme}
        onChange={(event) => {
          const next = event.target.value
          if (next === 'system' || next === 'light' || next === 'dark') {
            localStorage.setItem(THEME_KEY, next)
            setTheme(next)
          }
        }}
        className="h-10 rounded-md border border-input bg-background px-3 text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <option value="system">Systemowy</option>
        <option value="light">Jasny</option>
        <option value="dark">Ciemny</option>
      </select>
    </label>
  )
}
