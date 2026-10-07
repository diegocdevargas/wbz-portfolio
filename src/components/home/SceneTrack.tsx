import { serviceIcons, techMarks, valueLayout } from "@/content/home";
import type { Dictionary } from "@/content/dictionaries";
import { Icon } from "@/components/ui/Icon";
import { Marquee } from "@/components/ui/Marquee";
import { SceneStage } from "@/components/scene/SceneStage";
import { SceneChoreography } from "./SceneChoreography";
import styles from "./SceneTrack.module.css";

/**
 * The early Home experience: one sticky WebGL stage shared by four scroll regions.
 * Region and trigger sizes follow the live site (measured at 1440×900, kept in viewport
 * units), and the ids keep the live anchor names. `SceneChoreography` reads the
 * `data-*` hooks below to switch scene states and scrub the reveals.
 */
export function SceneTrack({ t }: { t: Dictionary["home"] }) {
  const { hero, values, services, journey } = t;
  return (
    <section id="landing-part-1" className={styles.track} aria-label="Webcraftz" data-scene-track>
      <div className={styles.stage} aria-hidden="true">
        <SceneStage />
      </div>

      {/* Hero copy over the scene; it scrolls away normally. */}
      <div id="hero-section" className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1 className={styles.heroTitle} data-appear>
            {hero.title.map((line) => (
              <span key={line.text} className={line.accent ? "accent" : undefined}>
                {line.text}
              </span>
            ))}
          </h1>
          <p className={styles.heroLead}>{hero.lead}</p>
          <Marquee className={styles.techMarquee} label={hero.techLabel} speed={40}>
            {techMarks.map((name) => (
              <li key={name} className={styles.techItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/images/tech/${name}.svg`} alt="" width={24} height={24} />
              </li>
            ))}
          </Marquee>
        </div>
      </div>

      {/* Why us: the scene shrinks to centre, then cards and heading are scrubbed in and out. */}
      <div id="why-us-section" className={styles.section} data-scene-state="why">
        <div className={styles.delay} />
        <div className={styles.pin}>
          <ul className={styles.valueCards}>
            {values.items.map((item, i) => {
              const { icon, side } = valueLayout[i];
              return (
              <li
                key={item.title}
                className={styles.valueCard}
                data-side={side}
                data-index={i}
                data-reveal={side === "left" ? "from-right" : "from-left"}
                data-reveal-group="why"
              >
                <span className={styles.connector} aria-hidden="true" />
                <div className={styles.card} data-cursor-target>
                  <h3 className={styles.cardTitle}>
                    <Icon name={icon} size={27} className={styles.cardIcon} />
                    {item.title}
                  </h3>
                  <p className={styles.cardBody}>{item.body}</p>
                </div>
              </li>
              );
            })}
          </ul>
          <div className={styles.valueHeading} data-reveal="rise-exit-up" data-reveal-group="why">
            <p className="eyebrow">{values.eyebrow}</p>
            <h2 className={styles.valueTitle}>
              {values.title.text} <span className="accent">{values.title.accent}</span>
            </h2>
          </div>
        </div>
        <div id="why-us-showup-trigger" className={styles.trigger} data-trigger="why-show" />
        <div className={styles.delay} />
        <div id="why-us-cleanup-trigger" className={styles.trigger} data-trigger="why-clean" />
      </div>

      {/* Services: the camera dives into the disk; heading, then the grid. */}
      <div id="features-section" className={styles.section} data-scene-state="features">
        <div className={styles.delay} />
        <div className={styles.pin}>
          <div className={styles.servicesHeading} data-reveal="rise-exit-up" data-reveal-group="features-title">
            <p className="eyebrow">{services.eyebrow}</p>
            <h2 className="section-title">
              {services.title.text}
              <br />
              <span className="accent">{services.title.accent}</span>
            </h2>
          </div>
          <ul className={styles.servicesGrid} data-reveal="rise" data-reveal-group="features-content">
            {services.items.map((item, i) => (
              <li key={item.title} className={styles.serviceCard} data-appear data-cursor-target>
                <span className={styles.serviceIcon}>
                  <Icon name={serviceIcons[i]} size={24} />
                </span>
                <div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardBody}>{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div id="features-title-showup-trigger" className={styles.trigger} data-trigger="features-title-show" />
        <div className={styles.delay} />
        <div id="features-content-showup-trigger" className={styles.trigger} data-trigger="features-content-show" />
        <div className={styles.delay} />
        <div id="features-cleanup-trigger" className={styles.trigger} data-trigger="features-clean" />
      </div>

      {/* Journey: the disk tilts away; each step's card lights up as it reaches mid-screen. */}
      <div id="journey-section" className={styles.journeySection} data-scene-state="journey">
        <div className={styles.journeyDelay} />
        <div id="journey-content" className={styles.journeyContent}>
          <h2 className="sr-only">{journey.srTitle}</h2>
          <ol className={styles.journey}>
            {journey.steps.map((step, i) => (
              <li key={step.title} className={styles.step} data-journey-step>
                <span className={styles.stepNumber} aria-hidden="true">
                  {i + 1}
                </span>
                <span className={styles.stepLine} aria-hidden="true" />
                <div className={`${styles.card} ${styles.stepCard}`} data-cursor-target>
                  <h3 className={styles.cardTitle}>
                    <span className="sr-only">{i + 1}. </span>
                    {step.title}
                  </h3>
                  <p className={styles.cardBody}>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <SceneChoreography />
    </section>
  );
}
