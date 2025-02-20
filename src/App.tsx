import { Copyright } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";

import { ModeToggle } from "@/components/mode-toggle";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { DENSITY_MAX } from "@/data/constants";
import { cn } from "@/lib/utils";

import { convert } from "./data";

const App = () => {
  const [input, setInput] = useState("");
  const [density, setDensity] = useState([DENSITY_MAX]);
  const [shouldFilterEmojis, setShouldFilterEmojis] = useState<boolean>(true);
  const [conversionResult, setConversionResult] = useState<string>();
  const [, copy] = useCopyToClipboard();

  const doConvert = () => {
    try {
      const result = convert({
        input,
        density: density[0],
        shouldFilterEmojis,
      });
      setConversionResult(result);

      if (result && result.trim() !== "") {
        toast.success("Successfully emojified! 🎉");
      } else {
        toast.error(
          "No emojis were added. Try adjusting your input or density."
        );
      }
    } catch (error) {
      console.error("Conversion error:", error);
      toast.error("Something went wrong during emojification... 🤔");
    }
  };

  const handleFilterChange = () => {
    setShouldFilterEmojis(!shouldFilterEmojis);
  };

  const getDensityEmoji = (densityValue: number[]) => {
    const density = densityValue[0];

    if (density <= 10) return "😶";
    if (density <= 20) return "😐";
    if (density <= 30) return "🙂";
    if (density <= 40) return "😀";
    if (density <= 50) return "😛";
    if (density <= 60) return "😅";
    if (density <= 70) return "😂";
    if (density <= 80) return "🤣";
    if (density <= 90) return "😈";
    return "💩";
  };

  const handleCopy = () => {
    if (conversionResult) {
      copy(conversionResult)
        .then(() => {
          toast.success("Copied!");
        })
        .catch(() => {
          toast.error("Error");
        });
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen flex flex-col">
        <header className="text-center space-y-6 mb-8 pt-8">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
            Emojify your text!
          </h1>
          <p className="text-muted-foreground text-lg italic">
            This algorithm was trained on text posts from the subreddit{" "}
            <a
              href="https://www.reddit.com/r/emojipasta"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              /r/emojipasta
            </a>
            .
          </p>
        </header>

        <main className="flex-grow container mx-auto px-4 pb-8 max-w-3xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doConvert();
            }}
            className="space-y-6"
          >
            <div>
              <label htmlFor="input-text" className="sr-only">
                Enter text to emojify
              </label>
              <Textarea
                id="input-text"
                className="min-h-40 w-full"
                value={input}
                onChange={(evt) => setInput(evt.target.value)}
                placeholder="Enter text to emojify"
                aria-describedby="density-label"
              />
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="w-full max-w-sm">
                <Label id="density-label" className="flex items-center gap-4">
                  <span className="w-fit whitespace-nowrap">
                    Emoji density:
                  </span>
                  <Slider
                    className=""
                    min={0}
                    max={DENSITY_MAX}
                    step={1}
                    defaultValue={density}
                    onValueChange={setDensity}
                    aria-valuetext={`${density}%`}
                  />
                  <span className="text-4xl" aria-hidden="true">
                    {getDensityEmoji(density)}
                  </span>
                </Label>
              </div>
              <Button type="submit" size="lg">
                CONVERT
              </Button>
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Checkbox
                  checked={shouldFilterEmojis}
                  onCheckedChange={handleFilterChange}
                  id="filter-emojis"
                />
                <span>Filter out inappropriate emojis</span>
              </Label>
            </div>
          </form>

          <section className="my-8" aria-live="polite">
            <h2 className="sr-only">Conversion Result</h2>
            <div
              className={cn(
                "p-4 border rounded-md min-h-40",
                conversionResult ? "opacity-100" : "opacity-50"
              )}
              id="conversion-result"
            >
              {conversionResult || "(Result will appear here)"}
            </div>
          </section>

          <Button
            onClick={handleCopy}
            disabled={!conversionResult}
            size="lg"
            className="w-full md:w-auto"
            aria-label="Copy result to clipboard"
          >
            COPY TO CLIPBOARD
          </Button>
        </main>

        <footer className="text-center py-6 px-4 bg-secondary">
          <p className="flex items-center justify-center gap-1">
            <Copyright className="h-4 w-4" aria-hidden="true" />
            <span>Mark Farnum {new Date().getFullYear()}</span>
          </p>
          <p className="text-muted-foreground mt-2">
            Like this tool? You can{" "}
            <a
              href="https://paypal.me/markfarnum"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              chip in
            </a>{" "}
            to pay for the server or{" "}
            <a
              href="https://github.com/farkmarnum/emojify"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              contribute
            </a>{" "}
            to improve the code.
          </p>
        </footer>

        <Toaster position="top-right" richColors />

        <div className="fixed bottom-4 right-4">
          <ModeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
