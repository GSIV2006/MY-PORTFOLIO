import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, Asterisk, Menu, X } from 'lucide-react'
import { achievements, certifications, community, creativeSkills, languages, personality, projects, timeline, tools } from './data/portfolio'
import { profile } from './data/profile'
import footballAction from './assets/football/venkat-playing.jpg'
import footballTeam from './assets/football/football-team.jpg'
import communityTeam from './assets/events/cloud-club-community.jpg'

const nav = [['About', '#about'], ['Work', '#work'], ['Beyond', '#beyond'], ['Contact', '#contact']]

function Cursor() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return
    const dot = document.querySelector<HTMLElement>('.cursor-dot')
    const ring = document.querySelector<HTMLElement>('.cursor-ring')
    if (!dot || !ring) return
    let x = 0, y = 0, rx = 0, ry = 0, frame = 0
    const move = (event: MouseEvent) => { x = event.clientX; y = event.clientY; dot.style.transform = `translate(${x}px, ${y}px)` }
    const animate = () => { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; ring.style.transform = `translate(${rx}px, ${ry}px)`; frame = requestAnimationFrame(animate) }
    const hover = (event: Event) => ring.classList.toggle('is-hover', (event.target as HTMLElement).closest('a,button,[data-hover]') !== null)
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', hover); animate()
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', hover); cancelAnimationFrame(frame) }
  }, [])
  return <><div className="cursor-dot"/><div className="cursor-ring"/></>
}

function Reveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const element = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const node = element.current
    if (!node) return
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target) }
    }), { threshold: 0.12 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [])
  return <div ref={element} className={`reveal-pending ${className}`}>{children}</div>
}

function PixelPong() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderFrame = useRef<() => void>(() => {})
  const game = useRef({ ballX: 120, ballY: 66, vx: 2.2, vy: 1.3, playerY: 66, aiY: 66, playerScore: 0, aiScore: 0, running: false })
  const [playing, setPlaying] = useState(false)
  const [score, setScore] = useState([0, 0])
  const [winner, setWinner] = useState('')

  useEffect(() => {
    const element = canvas.current
    const context = element?.getContext('2d')
    if (!element || !context) return
    const g = game.current
    let frame = 0
    const draw = () => {
      context.fillStyle = '#07100e'
      context.fillRect(0, 0, 240, 132)
      context.strokeStyle = 'rgba(150,190,168,.08)'
      context.lineWidth = 1
      for (let x = 16; x < 240; x += 16) { context.beginPath(); context.moveTo(x, 0); context.lineTo(x, 132); context.stroke() }
      for (let y = 12; y < 132; y += 12) { context.beginPath(); context.moveTo(0, y); context.lineTo(240, y); context.stroke() }
      context.fillStyle = 'rgba(193,203,163,.35)'
      for (let y = 4; y < 132; y += 12) context.fillRect(119, y, 2, 5)

      if (g.running) {
        g.ballX += g.vx; g.ballY += g.vy
        if (g.ballY < 4 || g.ballY > 128) g.vy *= -1
        g.aiY += Math.max(-1.15, Math.min(1.15, g.ballY - g.aiY)) * .72
        if (g.vx < 0 && g.ballX < 14 && Math.abs(g.ballY - g.aiY) < 17) { g.vx = Math.abs(g.vx); g.vy += (g.ballY - g.aiY) * .035 }
        if (g.vx > 0 && g.ballX > 226 && Math.abs(g.ballY - g.playerY) < 17) { g.vx = -Math.abs(g.vx); g.vy += (g.ballY - g.playerY) * .035 }
        if (g.ballX < -4 || g.ballX > 244) {
          if (g.ballX < 0) g.playerScore += 1; else g.aiScore += 1
          setScore([g.playerScore, g.aiScore])
          if (g.playerScore === 3 || g.aiScore === 3) {
            g.running = false
            setPlaying(false)
            setWinner(g.playerScore === 3 ? 'YOU WIN' : 'CPU WINS')
          } else {
            g.ballX = 120; g.ballY = 66; g.vx *= -1; g.vy = Math.random() > .5 ? 1.3 : -1.3
          }
        }
      }
      context.fillStyle = '#77d0a0'
      context.fillRect(8, Math.round(g.aiY / 4) * 4 - 12, 4, 24)
      context.fillStyle = '#e4a46e'
      context.fillRect(228, Math.round(g.playerY / 4) * 4 - 12, 4, 24)
      context.fillStyle = '#e5e2c8'
      context.fillRect(Math.round(g.ballX / 3) * 3, Math.round(g.ballY / 3) * 3, 5, 5)
      if (g.running) frame = window.requestAnimationFrame(draw)
    }
    renderFrame.current = draw
    draw()
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const start = () => {
    const wasRunning = game.current.running
    Object.assign(game.current, { ballX: 120, ballY: 66, vx: 2.2, vy: 1.3, playerY: 66, aiY: 66, playerScore: 0, aiScore: 0, running: true })
    setScore([0, 0]); setWinner(''); setPlaying(true)
    canvas.current?.focus()
    if (!wasRunning) renderFrame.current()
  }
  const stop = () => {
    game.current.running = false
    setPlaying(false)
    setWinner('STOPPED')
  }
  const movePaddle = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    game.current.playerY = Math.max(14, Math.min(118, (event.clientY - bounds.top) * 132 / bounds.height))
  }
  const moveWithKeys = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return
    event.preventDefault()
    game.current.playerY = Math.max(14, Math.min(118, game.current.playerY + (event.key === 'ArrowUp' ? -12 : 12)))
  }

  return <div className="pong-cabinet" aria-label="Pixel Pong mini-game">
    <div className="pong-head mono"><span>ARCADE / 01</span><span>{String(score[0]).padStart(2, '0')} : {String(score[1]).padStart(2, '0')}</span></div>
    <div className="pong-screen"><canvas ref={canvas} width="240" height="132" aria-label="Pong game. Move the copper paddle with the pointer or arrow keys." tabIndex={0} onPointerMove={movePaddle} onKeyDown={moveWithKeys}/>{!playing && <div className="pong-overlay"><span>{winner || 'PIXEL PONG'}</span></div>}</div>
    <div className="pong-controls"><span>{playing ? 'MOVE PADDLE · ↑ ↓' : 'POINTER OR ARROW KEYS'}</span>{playing ? <button onClick={stop}>STOP</button> : <button onClick={start}>{winner === 'STOPPED' ? 'START AGAIN' : winner ? 'REPLAY' : 'START'} <ArrowRight size={11}/></button>}</div>
  </div>
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeMoment, setActiveMoment] = useState(0)
  const [selectedProject, setSelectedProject] = useState(0)
  const [activePersonality, setActivePersonality] = useState('Football')

  return <>
    <Cursor />
    <header className="topbar">
      <a className="wordmark" href="#top" aria-label="Venkat, home">GSI<span>.</span></a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Main navigation">{nav.map(([label, href]) => <a onClick={() => setMenuOpen(false)} key={label} href={href}>{label}<span>↗</span></a>)}</nav>
      <a className="top-contact" href="#contact">Let’s talk <ArrowUpRight size={14}/></a>
      <button className="menu-toggle" aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main id="top">
      <section className="hero section-pad">
        <div className="hero-grid" aria-hidden="true"/><div className="hero-glow" aria-hidden="true"/>
        <div className="hero-meta mono"><span><i className="live-dot"/> AVAILABLE FOR WHAT’S NEXT</span><span>{profile.location} · 13°N 77°E</span></div>
        <div className="hero-copy">
          <p className="eyebrow mono">A HUMAN MULTI-HYPHENATE / 01—∞</p>
          <h1>MORE THAN<br/><span>ONE DIMENSION.</span></h1>
          <div className="hero-lower">
            <p className="hero-intro">I’m <strong>{profile.name}</strong> — an AI/ML student, builder, footballer, and creative. I find the interesting work at the intersection of things.</p>
            <a className="round-link" href="#about" aria-label="Explore the portfolio"><ArrowDown size={18}/></a>
          </div>
        </div>
        <div className="hero-stamp"><span>TECH</span><Asterisk/><span>SPORT</span><Asterisk/><span>CREATIVE</span><Asterisk/><span>LEADERSHIP</span></div>
        <div className="hero-index mono"><span>SCROLL TO EXPLORE</span><span>01 / 06</span></div>
      </section>

      <section className="intro section-pad" id="about">
        <div className="section-label mono"><span>01</span><span>THE THROUGH LINE</span></div>
        <div className="intro-content"><Reveal><h2>I learned to lead on the pitch, find my voice on stage, and build in the digital world.</h2><p className="body-large">Different arenas, same instinct: show up curious, take responsibility, and make something happen with the people around me.</p></Reveal></div>
        <div className="dimension-row">{['TECH', 'SPORT', 'THEATRE', 'LEADERSHIP', 'CREATIVE WORK'].map((item, i) => <span key={item}><b>0{i + 1}</b>{item}</span>)}</div>
      </section>

      <section className="work section-pad" id="work">
        <div className="section-label mono"><span>02</span><span>THINGS I BUILD</span></div>
        <div className="section-heading"><Reveal><h2>Curiosity,<br/><span>made tangible.</span></h2></Reveal><p>From AI-powered tools to connected devices, I like getting an idea out of the abstract and into someone’s hands.</p></div>
        {projects.length > 0 && <div className="project-feature">
          <div className="project-tabs" role="tablist" aria-label="Featured projects">{projects.map((project, index) => <button key={project.name} role="tab" aria-selected={selectedProject === index} className={selectedProject === index ? 'project-tab active' : 'project-tab'} onClick={() => setSelectedProject(index)}><span className="mono">{project.number}</span>{project.name}<ArrowUpRight size={16}/></button>)}</div>
          {projects.map((project, index) => index === selectedProject && <Reveal key={project.name} className="project-detail"><div className="project-visual"><div className="visual-orbit orbit-one"/><div className="visual-orbit orbit-two"/><div className="visual-core"><span className="mono">{project.number}</span><Asterisk size={70}/><small>IDEA → IMPACT</small></div><span className="visual-coordinate mono">BUILD / {project.name}</span><span className="visual-vertical mono">{project.category}</span></div><div className="project-copy"><p className="eyebrow mono">{project.category}</p><h3>{project.name}</h3><p className="project-desc">{project.description}</p><div className="project-explainer"><div><span className="mono">THE PROBLEM</span><p>{project.problem}</p></div><div><span className="mono">THE APPROACH</span><p>{project.solution}</p></div></div><div className="chips">{project.stack.map(tech => <span key={tech}>{tech}</span>)}</div><div className="project-actions">{project.github ? <a className="text-link" href={project.github} target="_blank" rel="noreferrer">View on GitHub <ArrowUpRight size={15}/></a> : <span className="mono placeholder-note">[ADD GITHUB LINK]</span>}{project.demo && <a className="text-link" href={project.demo} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={15}/></a>}</div></div></Reveal>)}
        </div>}
        <div className="tools-block"><div className="tools-heading"><p className="eyebrow mono">A TOOLKIT IN PROGRESS</p><p>Things I’ve explored, learned from, or used while building. No proficiency bars, just an open toolbox.</p><p className="platform-note"><span className="mono">PLATFORMS</span> Comfortable switching between macOS and Windows.</p></div><div className="tool-cloud">{tools.map((tool, i) => <span className={i % 5 === 0 ? 'tool accent' : 'tool'} key={tool}>{tool}</span>)}</div></div>
        <div className="credentials"><div className="credentials-head"><span className="eyebrow mono">LEARNING IN PUBLIC</span><span className="mono">CERTIFICATIONS & WORKSHOPS</span></div><div className="credential-list">{certifications.map(item => <article className="credential" key={item.title}><span className="credential-mark">↗</span><div><h3>{item.title}</h3><p>{item.issuer}{item.note && <span> · {item.note}</span>}</p></div></article>)}</div></div>
      </section>

      <section className="football section-pad" id="football">
        <div className="section-label mono"><span>03</span><span>BUILT ON THE PITCH</span></div>
        <div className="football-top"><Reveal><p className="eyebrow mono">A DIFFERENT KIND OF EDUCATION</p><h2>THE<br/><span>CAPTAIN’S</span><br/>YEARS.</h2></Reveal><p className="football-note">Football has been part of my life from U-10 through U-18. Around nine years as a captain taught me about trust, discipline, and leading when the game gets tight.</p></div>
        <div className="pitch-scene"><div className="pitch-lines"><span className="center-circle"/><span className="half-line"/><span className="box box-left"/><span className="box box-right"/><div className="pitch-word">PLAY<br/>YOUR<br/>PART<span>↗</span></div><div className="pitch-caption mono">TEAM SPORT · LIFE SKILLS</div></div><div className="pitch-aside"><div className="touchline-note"><span className="mono">FROM THE TOUCHLINE</span><p>Communication.<br/>Decision-making.<br/>Resilience.<br/>Team over self.</p></div><PixelPong/></div></div>
        <div className="football-timeline">{['U-10', 'U-18', 'CAPTAINCY', 'COMPETITIVE', 'I-LEAGUE LEVEL'].map((step, i) => <div className="football-step" key={step}><span className="step-dot"/><span className="mono">0{i + 1}</span><b>{step}</b>{i === 4 && <small>Raman Academy FC</small>}</div>)}</div>
        <div className="moment-gallery"><figure><img src={footballAction} alt="Venkat taking a shot during football practice" loading="lazy"/><figcaption><span className="mono">ON THE PITCH</span><small>A moment from football</small></figcaption></figure><figure><img src={footballTeam} alt="Venkat celebrating with football teammates" loading="lazy"/><figcaption><span className="mono">THE TEAM</span><small>Years built together</small></figcaption></figure><div className="achievement-card"><span className="eyebrow mono">SELECTED HIGHLIGHTS</span>{achievements.map(item => <p key={item}>{item}</p>)}</div></div>
      </section>

      <section className="beyond section-pad" id="beyond">
        <div className="section-label mono"><span>04</span><span>BEYOND THE BUILD</span></div>
        <div className="beyond-grid"><div className="beyond-lead"><Reveal><p className="eyebrow mono">MORE THAN A ROLE</p><h2>People,<br/>ideas,<br/><span>momentum.</span></h2></Reveal><p>Good work often happens before and after the code: getting people in the room, making the idea clear, and helping a team move.</p><img className="community-photo" src={communityTeam} alt="Venkat with fellow REVA University community members" loading="lazy"/><small className="photo-caption mono">AWS CLOUD CLUB · REVA UNIVERSITY</small></div><div className="community-list"><div className="mini-heading mono">LEADERSHIP & COMMUNITY / REVA UNIVERSITY</div><p className="community-intro">AWS Cloud Club / AWS Student Builder ecosystem · PR team</p>{community.map((item, i) => <article className="community-item" key={item.name}><span className="mono">{String(i + 1).padStart(2, '0')}</span><div><small className="mono">{item.type}</small><h3>{item.name}</h3><p>{item.detail}</p></div><ArrowUpRight size={16}/></article>)}<p className="community-foot">BUILD <b>+</b> COMMUNICATE <b>+</b> ORGANIZE <b>+</b> LEAD</p></div></div>
      </section>

      <section className="theatre section-pad">
        <div className="section-label mono"><span>05</span><span>ANOTHER SIDE OF THE STORY</span></div>
        <div className="theatre-grid"><div className="stage-card"><div className="stage-curtain curtain-left"/><div className="stage-curtain curtain-right"/><div className="stage-light"/><span className="stage-word">STAGE<br/>PRESENCE</span></div><div className="theatre-copy"><p className="eyebrow mono">SCHOOL THEATRE / DRAMA</p><h2>Before I built<br/>for screens, I<br/><span>found my voice.</span></h2><p>School theatre and drama gave me a different kind of stage. As a drama/theatre captain, I learned to perform, create together, communicate clearly, and bring a group into the moment.</p><div className="chips"><span>Confidence</span><span>Creativity</span><span>Teamwork</span><span>Communication</span></div></div></div>
      </section>

      <section className="timeline-section section-pad">
        <div className="section-label mono"><span>06</span><span>STILL IN MOTION</span></div><div className="timeline-head"><Reveal><h2>Not a straight line.<br/><span>A growing one.</span></h2></Reveal><p>Every chapter adds another way to contribute.</p></div>
        <div className="timeline-layout"><div className="timeline-nav">{timeline.map((item, i) => <button onClick={() => setActiveMoment(i)} className={activeMoment === i ? 'timeline-button active' : 'timeline-button'} key={item.label}><span className="mono">0{i + 1}</span><span>{item.label}</span><ArrowRight size={15}/></button>)}</div><div className="timeline-panel"><span className="timeline-big mono">0{activeMoment + 1}</span><p className="eyebrow mono">A MOMENT IN THE MAKING</p><h3>{timeline[activeMoment].label}</h3><p>{timeline[activeMoment].detail}</p><div className="timeline-progress"><span style={{ width: `${((activeMoment + 1) / timeline.length) * 100}%` }}/></div><span className="mono panel-count">{String(activeMoment + 1).padStart(2, '0')} / {String(timeline.length).padStart(2, '0')}</span></div></div>
      </section>

      <section className="creative section-pad"><div className="creative-quote"><span className="mono">THE OTHER TOOLKIT</span><p>Clear ideas travel further.</p><span className="quote-asterisk"><Asterisk/></span></div><div className="creative-body"><div><p className="eyebrow mono">COMMUNICATION IS A BUILDING SKILL</p><h2>Make it clear.<br/><span>Make it matter.</span></h2><p className="creative-intro">I enjoy the creative work around a project: shaping a message, designing a presentation, making an event feel inviting, and helping people see why an idea matters.</p></div><div className="creative-list">{creativeSkills.map((skill, i) => <span key={skill}><b className="mono">{String(i + 1).padStart(2, '0')}</b>{skill}<ArrowUpRight size={14}/></span>)}</div></div></section>

      <section className="personality section-pad"><div className="section-label mono"><span>07</span><span>THINGS THAT MAKE ME, ME</span></div><div className="personality-layout"><div><Reveal><h2>Many interests.<br/><span>One curious person.</span></h2></Reveal><p>Pick a thread. There’s always more to discover.</p></div><div className="personality-explorer"><div className="personality-tags">{personality.map((item, i) => <button className={activePersonality === item ? 'personality-tag active' : 'personality-tag'} key={item} onClick={() => setActivePersonality(item)}><span className="mono">0{i + 1}</span>{item}<ArrowUpRight size={14}/></button>)}</div><div className="personality-focus"><span className="mono">CURRENTLY EXPLORING</span><p>{activePersonality}<Asterisk size={20}/></p></div></div></div><div className="language-row"><div className="language-heading"><p className="eyebrow mono">LANGUAGES / VOICES / CONTEXTS</p><p>More than words: the ways we connect.</p></div><div className="language-list">{languages.map(item => <div className="language-card" key={item.language}><span className="mono">{item.language}</span>{item.level && <small>{item.level}</small>}</div>)}</div></div><p className="personal-footnote"><span className="mono">OFF THE CLOCK</span> My parents and Messi inspire me. I love films by and featuring Ram Charan, Quentin Tarantino, and RGV, plus anime that changes how I think.</p></section>

      <section className="contact section-pad" id="contact"><div className="section-label mono"><span>08</span><span>YOUR MOVE</span></div><div className="contact-main"><Reveal><p className="eyebrow mono">OPEN TO GOOD CONVERSATIONS</p><h2>Let’s build<br/>something worth<br/><span>talking about.</span></h2></Reveal><a className="contact-arrow" href={`mailto:${profile.email}`} aria-label="Email Venkat"><ArrowDownRight size={32}/></a></div><div className="contact-bottom"><div className="contact-info"><span className="mono">SAY HELLO</span><a href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={14}/></a><a href={`tel:${profile.phone.replaceAll(' ', '')}`}>{profile.phone}<ArrowUpRight size={14}/></a></div><div className="contact-socials">{profile.socials.map(item => <a key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}<ArrowUpRight size={14}/></a>)}</div></div></section>
    </main>
    <footer className="footer section-pad"><a className="wordmark" href="#top">GSI<span>.</span></a><span className="mono">BUILT WITH CURIOSITY · © {new Date().getFullYear()}</span><a href="#top" className="back-top">BACK TO TOP ↑</a></footer>
  </>
}
