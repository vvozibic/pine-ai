export type ParsedElement =
  | {
      type: "entry";
      label: string;
      direction: "long" | "short";
      condition: string;
    }
  | { type: "plot"; expr: string }
  | {
      type: "plotshape";
      condition: string;
      style?: string;
      location?: string;
      color?: string;
    }
  | {
      type: "plotchar";
      condition: string;
      char?: string;
      location?: string;
      color?: string;
    };

export function parsePine(pineCode: string): ParsedElement[] {
  const lines = pineCode.split("\n");
  const result: ParsedElement[] = [];

  for (const line of lines) {
    const clean = line.trim();

    // strategy.entry
    const entryMatch = clean.match(
      /strategy\.entry\(["'](.+?)["'],\s*strategy\.(long|short),\s*(.+?)\)/
    );
    if (entryMatch) {
      result.push({
        type: "entry",
        label: entryMatch[1],
        direction: entryMatch[2] as "long" | "short",
        condition: entryMatch[3],
      });
      continue;
    }

    // plot
    const plotMatch = clean.match(/plot\((.+?)\)/);
    if (plotMatch) {
      result.push({
        type: "plot",
        expr: plotMatch[1],
      });
      continue;
    }

    // plotshape
    const plotshapeMatch = clean.match(/plotshape\((.+?)\)/);
    if (plotshapeMatch) {
      const full = plotshapeMatch[1];
      const condMatch = full.match(/(.+?),/);
      const style = full.match(/style\s*=\s*shape\.(\w+)/)?.[1];
      const location = full.match(/location\s*=\s*location\.(\w+)/)?.[1];
      const color = full.match(/color\s*=\s*color\.(\w+)/)?.[1];

      result.push({
        type: "plotshape",
        condition: condMatch ? condMatch[1].trim() : full,
        style,
        location,
        color,
      });
      continue;
    }

    // plotchar
    const plotcharMatch = clean.match(/plotchar\((.+?)\)/);
    if (plotcharMatch) {
      const full = plotcharMatch[1];
      const condMatch = full.match(/(.+?),/);
      const char = full.match(/char\s*=\s*["'](.*?)["']/)?.[1];
      const location = full.match(/location\s*=\s*location\.(\w+)/)?.[1];
      const color = full.match(/color\s*=\s*color\.(\w+)/)?.[1];

      result.push({
        type: "plotchar",
        condition: condMatch ? condMatch[1].trim() : full,
        char,
        location,
        color,
      });
      continue;
    }
  }

  return result;
}
