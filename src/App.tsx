import { CoffeeDashboard } from "./components/CoffeeDashboard/CoffeeDashboard";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import { useTheme } from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      <CoffeeDashboard />
    </>
  );
}

export default App;
