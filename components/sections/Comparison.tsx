import { comparison } from "@/content/copy";
import { Icon } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * The reference's 3-column comparison matrix, as a real <table> so the
 * row/column relationship survives a screen reader. It is the one element
 * on the page allowed to scroll horizontally, inside its own container —
 * the page body never does.
 */
export default function Comparison() {
  return (
    <Section id="comparison">
      <SectionHeading
        eyebrow={comparison.eyebrow}
        title={comparison.title}
        align="center"
      />

      <Reveal className="mt-14 overflow-x-auto">
        <table className="w-full min-w-150 border-collapse text-left">
          {/* Derived from `comparison.columns` rather than a second
              hand-written string — the two can never drift apart. */}
          <caption className="sr-only">
            {comparison.columns[0]} compared with{" "}
            {comparison.columns.slice(1).join(" and ")}
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-2/5 pb-4" />
              {comparison.columns.map((col, i) => (
                <th
                  key={col}
                  scope="col"
                  className={`font-grotesk pb-4 text-center text-[0.72rem] font-bold tracking-[0.12em] uppercase ${
                    i === 0 ? "text-sage-deep" : "text-espresso-mute"
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.feature} className="border-t border-sand/70">
                <th
                  scope="row"
                  className="py-4 pr-6 text-[0.94rem] font-medium text-espresso"
                >
                  {row.feature}
                </th>
                {row.values.map((value, i) => (
                  <td
                    key={comparison.columns[i]}
                    className={`py-4 text-center ${
                      // Own column gets a tint, so the eye lands there first.
                      i === 0 ? "bg-sage-soft/40" : ""
                    }`}
                  >
                    {value ? (
                      <>
                        <Icon
                          name="check"
                          className={`mx-auto size-4.5 ${
                            i === 0 ? "text-sage-deep" : "text-espresso-mute"
                          }`}
                        />
                        <span className="sr-only">Yes</span>
                      </>
                    ) : (
                      <>
                        <Icon
                          name="minus"
                          className="mx-auto size-4.5 text-sand-strong"
                        />
                        <span className="sr-only">No</span>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </Section>
  );
}
