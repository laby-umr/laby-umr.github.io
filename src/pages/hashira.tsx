import React, { useState } from 'react';
import Layout from '@theme/Layout';
import styles from './hashira.module.css';

interface Hashira {
  id: number;
  name: string;
  title: string;
  breathing: string;
  quote: string;
  image: string;
  color: string;
}

const hashiraData: Hashira[] = [
  {
    id: 1,
    name: 'Kyojuro',
    title: 'Flame Hashira',
    breathing: 'Flame Breathing (Honō no kokyū)',
    quote: '"Set your heart ablaze! Go beyond your limits! I am Kyojuro Rengoku, the Flame Hashira! I will fulfill my duty! I will not allow anyone here to die!"',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCjXHakjV2sDwU5BNrOligreBUPvkQBvgtT5NOpOSAlQbcQbDWm5OwV_TXdjQmN3DzVayqh0V8bUBHEGxpHS56_PmNvXVsxxWRvGdV16vKaRkLactZV1zz1hAamckJHjHoda7TM2u1DPDyKfry_S67YGl4-2pSZHz-G9VDWY4CjLyFXOmYtnFZ5XeSUdmfuMFnO6-w8nvGOXf3NxN32b3FwgKOzlNBPvOwx_xwxgSWtaP16vc1d01C4IXqnm75E-32VpPIhA0dqJeA',
    color: 'error'
  },
  {
    id: 2,
    name: 'Giyu',
    title: 'Water Hashira',
    breathing: 'Water Breathing (Mizu no kokyū)',
    quote: '"Those who regretted their own actions, I would never trample over them. Because demons were once human too."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgXfnsOBZsBBUZ-X3ynxrPJok0kwGMVOHpawNi0Kje6D3QS7C3hE6lBxJV5Og8QlgmkbTsKG-8gBvJrdtVdKSVTwZkiiCBQ4m5WStsNhJ7Mum_tRMUF3nLiC-7guVRcxO37uJUNwV4mBD9RQOiFx_STc3UPJBUR1tuw1cAeKTph_TLM7n9By1BCGRNhcSlHUKk06Q34gDN_XUl1y3edlDEPVgRLNTjMpyGb_Z7V0ycDbKvfvT1iveYtSp0cnyrGTAI4iBaI2hlj3A',
    color: 'primary'
  },
  {
    id: 3,
    name: 'Shinobu',
    title: 'Insect Hashira',
    breathing: 'Insect Breathing (Mushi no kokyū)',
    quote: '"I may not have much strength, but I can use poison to kill demons."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyCFgc07uukFFf-J33F3FkhW66fJFGxT7CkTB6pTTftw74om-jscGtuUBZ6whc8pdOWPPGmMhKRwgQxMN6kc-cKlpXocQWw_XB8Z_nTXisdr4soNWndy0xToRMq9VQSbDNYTYEd8YPTTwI7GZoBAjkXr8SU62u50Mnkxh5kLO6Se9xbqMLWjdiv5pFS-9wehdAJmr-PY1dG0KCby_SzE4Voc9QP_BVD7S35RPOlR0qg5hIL7mD_PHnZmwpyRl0q0ZHgRBW_nPLV9M',
    color: 'tertiary'
  },
  {
    id: 4,
    name: 'Tengen',
    title: 'Sound Hashira',
    breathing: 'Sound Breathing (Oto no kokyū)',
    quote: '"I am the god of festivals! Tengen Uzui!"',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApI-Dh4d_YW3NFKLd3WsEtnDHrH2jUxjMcfqCAGNnNWZ8i90GDViwXQpoBuAwrsvChhzUglKd12cflcnOZ7MtxvkU5NPLGcx3XmsGYs0ZaiquOdiOaU8rHxxi0Gor25urFCKwoJT7chimlOXYMTwOTMGZ-FLlZCDB6YFNRUhf7DZ8hh4aeYzNvwhrODnW5cgRUkhjwHxeV-thhFnFt7KWR14fxGhHwC6A98-T1f1KeZU9U1oGA7gNtlDgDdwMdTQkMY2H7j3wPIFc',
    color: 'secondary'
  },
  {
    id: 5,
    name: 'Mitsuri',
    title: 'Love Hashira',
    breathing: 'Love Breathing (Koi no kokyū)',
    quote: '"I want to be useful to everyone! I want to help!"',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUj4Ay5stzQbKUfIQ8bBQWCOjRufYgskVbxk4CdAoVCyz0tAphzmoc6BZEhFbAuXbnU76O4Ac2653pbfu7AfzdwV_rpPZLdPdZikzFs73Is8DVdWN5Cv21rmgnC1gZZUCozZWmCr46fHZ9MRskJqyQtrrqcH1ZWsgOJLL_nClElph9pakFQWcDpyhDxHk7nyZkLdZXmfglVTwSq5fM3O8288AHrMAj6TNBhA6r2lNydnuelvrMnZyl7VVYVzgEAC3fuLfBphFKgyg',
    color: 'tertiary-fixed'
  },
  {
    id: 6,
    name: 'Muichiro',
    title: 'Mist Hashira',
    breathing: 'Mist Breathing (Kasumi no kokyū)',
    quote: '"I\'ll defeat you even if it costs me my life."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABGGet368CMnhfwLe__MX9IVUKnlZjc5w4kX89oHmBDNUmhMW2k5eRAg7MRckWuYXXAO1G8cMAQ5jKped_bQmwaKPxcwWdu388YGb7zXffhFX3xNnyMlfoYhY-t37dev4TOTSoQDmxfLSMTHhZrPuYKo6Cb7yn-aJ6eDR7ceRTK_jyPrTKJrLs5UvK6qmxPBsvVuAs3XzSsNPR8_hZpbjYwGLtdRA5uk1KlkRVEeo2ydTJRzkkfAwEhh6dJOGJJ85VPoRzEaac3QY',
    color: 'outline-variant'
  },
  {
    id: 7,
    name: 'Gyomei',
    title: 'Stone Hashira',
    breathing: 'Stone Breathing (Iwa no kokyū)',
    quote: '"Namu Amida Butsu... May Buddha guide you."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJPM74o4yUjhOror1uZ_2A04Uxy2734LhEvmz6M7R3HnqpHMHUeDe-pOjM2-mEGLhq4-5HWy5RJ_DQLAAHGyXOllFb9mAZb6QdQO5aBqxwhbtDM3G2DieX04aVtodw_Sh51EMIZHZKiflEaxlVsx2tRdQkDnWoURjiUP3CUEflwA7R0981f-qYF8ctBwjd8Xyhgs8sHVHkL9iYvXLS5u0agQBVfjCzGR8TzT1hV_Gf3D3GTWnH_HfszIpWc8WiPABlk_RN7QWqs4s',
    color: 'secondary-dim'
  },
  {
    id: 8,
    name: 'Sanemi',
    title: 'Wind Hashira',
    breathing: 'Wind Breathing (Kaze no kokyū)',
    quote: '"I\'ll kill every last demon!"',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu2EStrNltOus6qq4e-fD1q6ZK3cYnQ8MNOJ51Rqw_cdnsm95QIuhQbZ-Lfj5EoD4yCS351-crqefW-LJAh0YgsnPyOMQIr9v9qoGfVMdlBNS4dOpfaU_gk2237aO3_zlPaW5Uh3_3lqW10xGfrnN2dsyDuxirGhNhs_-Qdeh0t3XNSQSlhK4HVYz_UB9xBvRd86hIgQqS-DEQN9waz9lcexv8S7ThrSO61GalUeQ_934Ex10XmitoZb6XfZm7fPjIgWD-yFjgnUM',
    color: 'on-surface-variant'
  },
  {
    id: 9,
    name: 'Obanai',
    title: 'Serpent Hashira',
    breathing: 'Serpent Breathing (Hebi no kokyū)',
    quote: '"I will protect what needs to be protected."',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNQEQVdRe-KwI7k_-OBZ0InI3hMVprwDFYwEg4od3JZwjmO80fekcboNBfw-ZVOsqwz6I2oXRTLOawGF2B_SiUuJTZan9Y5wIBqXFMwV09YhdtpNfk77FH0iz-myA2cUmDwMRdZQnXd5b4yKIwmLJ3l2i9WuySX8KSLn_tEKUWWz0crEOV7HihlIS4oefGlQKmgKBcuhSEt2bevHc3dLkgMh4GFWBejn38RWXCYsD-TWllfBDoDwUPBiFvVSyEGZNbivm9ebwSCgs',
    color: 'inverse-primary'
  }
];

export default function HashiraSelection(): JSX.Element {
  const [selectedHashira, setSelectedHashira] = useState<Hashira>(hashiraData[0]);

  return (
    <Layout
      title="Hashira Corps Selection"
      description="Choose your Hashira - Demon Slayer Corps">
      <div className={styles.hashiraPage}>
        {/* Background Elements */}
        <div className={styles.mangaLines}></div>
        <div className={styles.bgKanji}>滅</div>

        {/* Header Section */}
        <header className={styles.header}>
          <div className={styles.badge}>Final Selection</div>
          <h1 className={styles.mainTitle}>
            Choose Your <span className={styles.titleHighlight}>Hashira</span>
          </h1>
          <p className={styles.subtitle}>
            Select a pillar of the Demon Slayer Corps. Each Hashira possesses unique Breathing Styles and unmatched combat prowess to face the Kizuki.
          </p>
        </header>

        {/* Selection Grid */}
        <section className={styles.selectionGrid}>
          {/* Row 1: 4 Characters */}
          <div className={`${styles.gridRow} ${styles.row4}`}>
            {hashiraData.slice(0, 4).map((hashira, index) => (
              <div
                key={hashira.id}
                className={`${styles.characterCard} ${index % 2 === 0 ? styles.staggerOdd : styles.staggerEven}`}
                onClick={() => setSelectedHashira(hashira)}
              >
                <div className={styles.cardContent}>
                  <div className={`${styles.aura} ${styles[`aura${hashira.color}`]}`}></div>
                  <div className={styles.cardBorder}></div>
                  <img
                    src={hashira.image}
                    alt={`${hashira.name} - ${hashira.title}`}
                    className={styles.characterPortrait}
                  />
                  <div className={styles.cardInfo}>
                    <div className={styles.characterName}>{hashira.name}</div>
                    <div className={`${styles.characterTitle} ${styles[`title${hashira.color}`]}`}>
                      {hashira.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 5 Characters */}
          <div className={`${styles.gridRow} ${styles.row5}`}>
            {hashiraData.slice(4, 9).map((hashira, index) => (
              <div
                key={hashira.id}
                className={`${styles.characterCard} ${index % 2 === 0 ? styles.staggerEven : styles.staggerOdd}`}
                onClick={() => setSelectedHashira(hashira)}
              >
                <div className={styles.cardContent}>
                  <div className={`${styles.aura} ${styles[`aura${hashira.color}`]}`}></div>
                  <div className={styles.cardBorder}></div>
                  <img
                    src={hashira.image}
                    alt={`${hashira.name} - ${hashira.title}`}
                    className={styles.characterPortrait}
                  />
                  <div className={styles.cardInfo}>
                    <div className={styles.characterName}>{hashira.name}</div>
                    <div className={`${styles.characterTitle} ${styles[`title${hashira.color}`]}`}>
                      {hashira.title}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dynamic Info Board */}
        <div className={styles.infoBoard}>
          <div className={styles.infoBoardContent}>
            <div className={styles.activeMissionBadge}>Active Mission</div>
            <div className={styles.infoBoardGrid}>
              <div className={styles.infoBoardImage}>
                <img
                  src={selectedHashira.image}
                  alt={selectedHashira.name}
                  className={styles.selectedImage}
                />
              </div>
              <div className={styles.infoBoardDetails}>
                <h2 className={styles.selectedTitle}>
                  Selected: <span className={styles.selectedName}>{selectedHashira.title}</span>
                </h2>
                <div className={styles.breathingStyle}>
                  <span className="material-symbols-outlined">swords</span>
                  Breathing Style: {selectedHashira.breathing}
                </div>
                <p className={styles.quote}>{selectedHashira.quote}</p>
                <button className={styles.confirmButton}>
                  Confirm Selection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
