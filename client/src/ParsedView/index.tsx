import styles from "./ParsedView.module.css";
import { parsePine } from "./parsePine";

interface Props {
  code: string;
}

export default function ParsedView({ code }: Props) {
  const parsed = parsePine(code);

  if (parsed.length === 0) {
    return <div className={styles.container}>📭 Ничего не найдено</div>;
  }

  return (
    <div className={styles.container}>
      <h3>🧠 Разбор стратегии</h3>
      <ul className={styles.list}>
        {parsed.map((item, i) => (
          <li key={i} className={styles.item}>
            {item.type === "entry" && (
              <>
                📌 Entry: <b>{item.label}</b> — <i>{item.direction}</i>
                <br />
                Условие: <code>{item.condition}</code>
              </>
            )}

            {item.type === "plot" && (
              <>
                📈 Plot: <code>{item.expr}</code>
              </>
            )}

            {item.type === "plotshape" && (
              <>
                🔹 Shape: <code>{item.condition}</code>
                <br />
                style={item.style}, location={item.location}, color={item.color}
              </>
            )}

            {item.type === "plotchar" && (
              <>
                🔸 Char: <code>{item.condition}</code>
                <br />
                char="{item.char}", location={item.location}, color={item.color}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
