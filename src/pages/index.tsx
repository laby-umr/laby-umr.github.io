import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './index.module.css';
import LoadingScreen from '@site/src/components/Loading/LoadingScreen';

interface Hashira {
  id: number;
  name: string;
  title: string;
  breathing: string;
  quote: string;
  image: string;
  color: string;
}

interface Character {
  id: number;
  name: string;
  nameEn: string;
  image: string;
  color: string;
}

const characterData: Character[] = [
  {
    id: 1,
    name: '贝蒂',
    nameEn: 'Beatrice',
    image: '/img/home/贝蒂.jpg',
    color: 'yellow-blue' // 明黄+粉蓝
  },
  {
    id: 2,
    name: '艾米莉亚',
    nameEn: 'Emilia',
    image: '/img/home/艾米莉亚.jpg',
    color: 'purple-pink' // 深紫+玫粉
  },
  {
    id: 3,
    name: '艾米莉亚',
    nameEn: 'Emilia',
    image: '/img/home/艾米莉亚2.jpg',
    color: 'purple-pink' // 深紫+玫粉
  },
  {
    id: 4,
    name: '拉姆',
    nameEn: 'Ram',
    image: '/img/home/拉姆.jpg',
    color: 'cyan-pink' // 浅青+玫红
  },
  {
    id: 5,
    name: '蕾姆',
    nameEn: 'Rem',
    image: '/img/home/蕾姆-蓝.jpg',
    color: 'pink-blue' // 亮粉+青蓝
  },
  {
    id: 6,
    name: '蕾姆',
    nameEn: 'Rem',
    image: '/img/home/蕾姆-红.jpg',
    color: 'pink-blue' // 亮粉+青蓝
  },
  {
    id: 7,
    name: '菜月昂',
    nameEn: 'Subaru',
    image: '/img/home/菜月昂.jpg',
    color: 'gray-orange' // 灰+橙黑
  }
];

const hashiraData: Hashira[] = [
  {
    id: 1,
    name: '富冈义勇',
    title: '水柱 Water Hashira',
    breathing: 'Water Breathing (Mizu no kokyū)',
    quote: '"Those who regretted their own actions, I would never trample over them. Because demons were once human too."',
    image: '/img/home/水柱·富冈义勇.jpg',
    color: 'primary' // 海蓝色/藏青色
  },
  {
    id: 2,
    name: '炼狱杏寿郎',
    title: '炎柱 Flame Hashira',
    breathing: 'Flame Breathing (Honō no kokyū)',
    quote: '"Set your heart ablaze! Go beyond your limits! I am Kyojuro Rengoku, the Flame Hashira! I will fulfill my duty! I will not allow anyone here to die!"',
    image: '/img/home/炎柱·炼狱杏寿郎.jpg',
    color: 'error' // 炽红色/橙红色
  },
  {
    id: 3,
    name: '悲鸣屿行冥',
    title: '岩柱 Stone Hashira',
    breathing: 'Stone Breathing (Iwa no kokyū)',
    quote: '"Namu Amida Butsu... May Buddha guide you."',
    image: '/img/home/岩柱·悲鸣屿行冥.jpg',
    color: 'secondary-dim' // 深灰色/褐色
  },
  {
    id: 4,
    name: '不死川实弥',
    title: '风柱 Wind Hashira',
    breathing: 'Wind Breathing (Kaze no kokyū)',
    quote: '"I\'ll kill every last demon!"',
    image: '/img/home/风柱·不死川实弥.jpg',
    color: 'secondary' // 鲜绿色
  },
  {
    id: 5,
    name: '时透无一郎',
    title: '霞柱 Mist Hashira',
    breathing: 'Mist Breathing (Kasumi no kokyū)',
    quote: '"I\'ll defeat you even if it costs me my life."',
    image: '/img/home/霞柱·时透无一郎.jpg',
    color: 'outline-variant' // 透明白色/浅紫色
  },
  {
    id: 6,
    name: '甘露寺蜜璃',
    title: '恋柱 Love Hashira',
    breathing: 'Love Breathing (Koi no kokyū)',
    quote: '"I want to be useful to everyone! I want to help!"',
    image: '/img/home/恋柱·甘露寺蜜璃.jpg',
    color: 'tertiary-fixed' // 樱花粉色
  },
  {
    id: 7,
    name: '伊黑小芭内',
    title: '蛇柱 Serpent Hashira',
    breathing: 'Serpent Breathing (Hebi no kokyū)',
    quote: '"I will protect what needs to be protected."',
    image: '/img/home/蛇柱·伊黑小芭内.jpg',
    color: 'inverse-primary' // 深绿色
  },
  {
    id: 8,
    name: '宇髓天元',
    title: '音柱 Sound Hashira',
    breathing: 'Sound Breathing (Oto no kokyū)',
    quote: '"I am the god of festivals! Tengen Uzui!"',
    image: '/img/home/音柱·宇髓天元.jpg',
    color: 'error' // 橘红色/暗红色
  },
  {
    id: 9,
    name: '蝴蝶忍',
    title: '虫柱 Insect Hashira',
    breathing: 'Insect Breathing (Mushi no kokyū)',
    quote: '"I may not have much strength, but I can use poison to kill demons."',
    image: '/img/home/虫柱·蝴蝶忍.jpg',
    color: 'tertiary' // 浅紫色/靛青色
  }
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  const [showLoading, setShowLoading] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);
  const [selectedHashira, setSelectedHashira] = useState<Hashira>(hashiraData[0]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character>(characterData[0]);
  const [isGlitching, setIsGlitching] = useState(false);

  // 检查是否已经访问过（本次会话）
  useEffect(() => {
    const visited = sessionStorage.getItem('hasVisitedSite');
    if (visited) {
      setShowLoading(false);
      setHasVisited(true);
    }
  }, []);

  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasVisitedSite', 'true');
    setShowLoading(false);
    setHasVisited(true);
  };

  const handleCharacterSelect = (character: Character) => {
    if (isGlitching) return;
    
    setIsGlitching(true);
    
    // 切换角色
    setTimeout(() => {
      setSelectedCharacter(character);
    }, 150);
    
    // 结束故障效果
    setTimeout(() => {
      setIsGlitching(false);
    }, 300);
  };

  // 如果显示 loading，只渲染 loading 页面
  if (showLoading && !hasVisited) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }
  
  return (
    <Layout
      title={translate({
        id: 'homepage.title',
        message: 'DevManga - 代码的呼吸法',
        description: 'The homepage title'
      })}
      description={translate({
        id: 'homepage.description',
        message: 'Slicing through bugs with First Form: Water-Cooled Logic',
        description: 'The homepage description'
      })}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadge}>
              <Translate id="homepage.hero.badge">HASHIRA OF CODE</Translate>
            </div>
            
            <h1 className={styles.heroTitle}>
              <Translate id="homepage.hero.title.part1">Mastering the</Translate>{' '}
              <span className={styles.heroTitleAccent}>
                <Translate id="homepage.hero.title.part2">Dev-Breathing</Translate>
              </span>
            </h1>
            
            <p className={styles.heroDescription}>
              <Translate id="homepage.hero.description">
                Slicing through bugs with First Form: Water-Cooled Logic. 
                Merging ancient full-stack techniques with Neo-Tokyo speed.
              </Translate>
            </p>
            
            <div className={styles.heroActions}>
              <Link to="/blog" className={styles.heroPrimaryButton}>
                <span><Translate id="homepage.hero.button.blog">UNSHEATHE BLOG</Translate></span>
              </Link>
              <Link to="/projects" className={styles.heroSecondaryButton}>
                <span><Translate id="homepage.hero.button.projects">ARMORY</Translate></span>
              </Link>
            </div>
          </div>
          
          <div className={styles.heroVisual}>
            <div className={styles.heroImageContainer} data-color={selectedCharacter.color}>
              <div className={`${styles.heroImageBorder} ${isGlitching ? styles.glitching : ''}`}></div>
              <div className={`${styles.heroImage} ${isGlitching ? styles.glitching : ''}`}>
                <div className={styles.heroImageContent}>
                  <img src={selectedCharacter.image} alt={selectedCharacter.name} className={styles.heroImageReal} />
                  <div className={styles.heroCharacterInfo}>
                    <div className={styles.heroCharacterName}>{selectedCharacter.name}</div>
                    <div className={styles.heroCharacterNameEn}>{selectedCharacter.nameEn}</div>
                  </div>
                </div>
              </div>
              <div className={styles.heroSticker}>
                <Translate id="homepage.hero.sticker">TOTAL CONCENTRATION*</Translate>
              </div>
            </div>
            
            {/* Character Selection Cards */}
            <div className={styles.characterSelection}>
              <div className={styles.characterRow}>
                {characterData.slice(0, 4).map((character) => (
                  <div
                    key={character.id}
                    className={`${styles.characterSelectCard} ${selectedCharacter.id === character.id ? styles.activeCard : ''}`}
                    data-color={character.color}
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <div className={styles.characterCardContent}>
                      <div className={`${styles.characterAura} ${styles[`aura${character.color}`]}`}></div>
                      <img
                        src={character.image}
                        alt={character.name}
                        className={styles.characterSelectImage}
                      />
                      <div className={styles.characterSelectInfo}>
                        <div className={styles.characterSelectName}>{character.name}</div>
                        <div className={styles.characterSelectNameEn}>{character.nameEn}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className={styles.characterRow}>
                {characterData.slice(4, 7).map((character) => (
                  <div
                    key={character.id}
                    className={`${styles.characterSelectCard} ${selectedCharacter.id === character.id ? styles.activeCard : ''}`}
                    data-color={character.color}
                    onClick={() => handleCharacterSelect(character)}
                  >
                    <div className={styles.characterCardContent}>
                      <div className={`${styles.characterAura} ${styles[`aura${character.color}`]}`}></div>
                      <img
                        src={character.image}
                        alt={character.name}
                        className={styles.characterSelectImage}
                      />
                      <div className={styles.characterSelectInfo}>
                        <div className={styles.characterSelectName}>{character.name}</div>
                        <div className={styles.characterSelectNameEn}>{character.nameEn}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className={styles.techStack}>
        <div className={styles.techStackContainer}>
          <div className={styles.techStackHeader}>
            <div>
              <h2 className={styles.techStackTitle}>
                <Translate id="homepage.techStack.title">CURRENT ARSENAL</Translate>
              </h2>
              <p className={styles.techStackSubtitle}>
                <Translate id="homepage.techStack.subtitle">Breathing forms for high performance</Translate>
              </p>
            </div>
            <div className={styles.techStackBadge}>
              <Translate id="homepage.techStack.badge">LEVEL 99 TECH STACK</Translate>
            </div>
          </div>
          
          <div className={styles.techGrid}>
            {[
              { icon: 'data_object', name: 'TypeScript' },
              { icon: 'layers', name: 'React/Next' },
              { icon: 'database', name: 'PostgreSQL' },
              { icon: 'cloud_done', name: 'Cloudflare' },
              { icon: 'terminal', name: 'Rust-Lang' },
              { icon: 'shield_with_heart', name: 'Zod/Security' },
              { icon: 'code', name: 'Node.js' },
              { icon: 'api', name: 'REST API' },
              { icon: 'storage', name: 'Redis' },
              { icon: 'deployed_code', name: 'Docker' },
            ].map((tech, index) => (
              <div key={tech.name} className={`${styles.techCard} ${styles[`techCard${index % 3}`]}`}>
                <span className={`material-symbols-outlined ${styles.techIcon}`}>
                  {tech.icon}
                </span>
                <span className={styles.techName}>{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hashira Selection Section */}
      <section className={styles.hashiraSection}>
        <div className={styles.hashiraContainer}>
          {/* Background Elements */}
          <div className={styles.mangaLines}></div>
          <div className={styles.bgKanji}>滅</div>

          {/* Header */}
          <header className={styles.hashiraHeader}>
            <div className={styles.hashiraBadge}>Final Selection</div>
            <h2 className={styles.hashiraTitle}>
              Choose Your <span className={styles.hashiraTitleHighlight}>Hashira</span>
            </h2>
            <p className={styles.hashiraSubtitle}>
              Select a pillar of the Demon Slayer Corps. Each Hashira possesses unique Breathing Styles and unmatched combat prowess to face the Kizuki.
            </p>
          </header>

          {/* Selection Grid */}
          <div className={styles.hashiraGrid}>
            {/* Row 1: 4 Characters */}
            <div className={`${styles.hashiraRow} ${styles.hashiraRow4}`}>
              {hashiraData.slice(0, 4).map((hashira, index) => (
                <div
                  key={hashira.id}
                  className={`${styles.hashiraCard} ${index % 2 === 0 ? styles.hashiraStaggerOdd : styles.hashiraStaggerEven}`}
                  onClick={() => setSelectedHashira(hashira)}
                >
                  <div className={styles.hashiraCardContent}>
                    <div className={`${styles.hashiraAura} ${styles[`hashiraAura${hashira.color}`]}`}></div>
                    <div className={styles.hashiraCardBorder}></div>
                    <img
                      src={hashira.image}
                      alt={`${hashira.name} - ${hashira.title}`}
                      className={styles.hashiraPortrait}
                    />
                    <div className={styles.hashiraCardInfo}>
                      <div className={styles.hashiraName}>{hashira.name}</div>
                      <div className={`${styles.hashiraRank} ${styles[`hashiraRank${hashira.color}`]}`}>
                        {hashira.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: 5 Characters */}
            <div className={`${styles.hashiraRow} ${styles.hashiraRow5}`}>
              {hashiraData.slice(4, 9).map((hashira, index) => (
                <div
                  key={hashira.id}
                  className={`${styles.hashiraCard} ${index % 2 === 0 ? styles.hashiraStaggerEven : styles.hashiraStaggerOdd}`}
                  onClick={() => setSelectedHashira(hashira)}
                >
                  <div className={styles.hashiraCardContent}>
                    <div className={`${styles.hashiraAura} ${styles[`hashiraAura${hashira.color}`]}`}></div>
                    <div className={styles.hashiraCardBorder}></div>
                    <img
                      src={hashira.image}
                      alt={`${hashira.name} - ${hashira.title}`}
                      className={styles.hashiraPortrait}
                    />
                    <div className={styles.hashiraCardInfo}>
                      <div className={styles.hashiraName}>{hashira.name}</div>
                      <div className={`${styles.hashiraRank} ${styles[`hashiraRank${hashira.color}`]}`}>
                        {hashira.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info Board */}
          <div className={styles.hashiraInfoBoard}>
            <div className={styles.hashiraInfoContent}>
              <div className={styles.hashiraActiveBadge}>Active Mission</div>
              <div className={styles.hashiraInfoGrid}>
                <div className={styles.hashiraInfoImage}>
                  <img
                    src={selectedHashira.image}
                    alt={selectedHashira.name}
                    className={styles.hashiraSelectedImage}
                  />
                </div>
                <div className={styles.hashiraInfoDetails}>
                  <h3 className={styles.hashiraSelectedTitle}>
                    Selected: <span className={styles.hashiraSelectedName}>{selectedHashira.title}</span>
                  </h3>
                  <div className={styles.hashiraBreathingStyle}>
                    <span className="material-symbols-outlined">swords</span>
                    Breathing Style: {selectedHashira.breathing}
                  </div>
                  <p className={styles.hashiraQuote}>{selectedHashira.quote}</p>
                  <button className={styles.hashiraConfirmButton}>
                    Confirm Selection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comic Panel Blog Section */}
      <section className={styles.comicPanelSection}>
        <div className={styles.comicContainer}>
          <h2 className={styles.comicTitle}>
            <Translate id="homepage.blog.title">LATEST CHAPTERS</Translate>
          </h2>
          
          <div className={styles.comicGrid}>
            {/* Large Panel */}
            <Link to="/blog" className={styles.comicPanelLarge}>
              <div className={styles.panelBadge}>
                <Translate id="homepage.blog.featured.badge">TUTORIAL</Translate>
              </div>
              <h3 className={styles.panelTitle}>
                <Translate id="homepage.blog.featured.title">
                  Thunder Breathing: Seventh Form - Honoikazuchi no Kami (The API God)
                </Translate>
              </h3>
              <div className={styles.panelImage}>
                <img src="/img/blog/blog-1.jpg" alt="Tutorial" className={styles.panelImageReal} />
              </div>
              <p className={styles.panelDescription}>
                <Translate id="homepage.blog.featured.description">
                  Learn how to execute lightning-fast queries that would make Zenitsu proud. We explore async optimization and reactive patterns for the modern web demon hunter...
                </Translate>
              </p>
              <div className={styles.panelReadMore}>
                <Translate id="homepage.blog.readMore">READ MORE</Translate> <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </Link>
            
            {/* Right Stack Panels */}
            <div className={styles.comicPanelStack}>
              <Link to="/blog" className={styles.comicPanelSmall1}>
                <div className={styles.panelBadgeSmall}>
                  <Translate id="homepage.blog.post1.badge">Opinion</Translate>
                </div>
                <h4 className={styles.panelTitleSmall}>
                  <Translate id="homepage.blog.post1.title">
                    Why CSS Grid is basically Constant Concentration
                  </Translate>
                </h4>
                <p className={styles.panelDescSmall}>
                  <Translate id="homepage.blog.post1.description">
                    Maintaining layout state is like maintaining your breathing while sleeping...
                  </Translate>
                </p>
                <div className={styles.panelLinkSmall}>
                  <Translate id="homepage.blog.readEpisode">Read Episode</Translate>
                </div>
              </Link>
              
              <Link to="/blog" className={styles.comicPanelSmall2}>
                <div className={styles.panelBadgeSmall}>
                  <Translate id="homepage.blog.post2.badge">Review</Translate>
                </div>
                <h4 className={styles.panelTitleSmall}>
                  <Translate id="homepage.blog.post2.title">
                    Nichirin Keyboards: Mechanical Switch Quest
                  </Translate>
                </h4>
                <p className={styles.panelDescSmall}>
                  <Translate id="homepage.blog.post2.description">
                    Forging the perfect typing experience with color-changing LEDs...
                  </Translate>
                </p>
                <div className={styles.panelLinkSmall}>
                  <Translate id="homepage.blog.readEpisode">Read Episode</Translate>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Bottom Comic Strip */}
          <div className={styles.comicStrip}>
            {[
              { 
                titleId: 'homepage.blog.strip1.title',
                title: 'Zero to Pillar: Rust Basics', 
                timeId: 'homepage.blog.strip1.time',
                time: '5 MIN READ', 
                img: '/img/blog/blog-2.jpg' 
              },
              { 
                titleId: 'homepage.blog.strip2.title',
                title: 'Recovery Training: Coffee Guide', 
                timeId: 'homepage.blog.strip2.time',
                time: '8 MIN READ', 
                img: '/img/blog/blog-3.jpg' 
              },
              { 
                titleId: 'homepage.blog.strip3.title',
                title: 'Visualizing Blood Demon Arts with D3', 
                timeId: 'homepage.blog.strip3.time',
                time: '12 MIN READ', 
                img: '/img/blog/blog-4.jpg' 
              },
            ].map((item, index) => (
              <Link key={index} to="/blog" className={styles.comicStripCard}>
                <div className={styles.stripImage}>
                  <img src={item.img} alt={item.title} className={styles.stripImageReal} />
                </div>
                <h4 className={styles.stripTitle}>
                  <Translate id={item.titleId}>{item.title}</Translate>
                </h4>
                <span className={styles.stripTime}>
                  <Translate id={item.timeId}>{item.time}</Translate>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAB for Newsletter */}
      <Link to="/contact" className={styles.fab}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          mail
        </span>
      </Link>
    </Layout>
  );
}
