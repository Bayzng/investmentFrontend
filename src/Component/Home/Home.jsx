import React, { useEffect, useRef } from "react";
import "./Home.css";
import Hero from "../Hero/Hero";
// import Register from "../Authentication/Register/Register";
import TradingDashboard from "../TradingDashboard/TradingDashboard";
import { Link } from "react-router-dom";

const Home = () => {
  const canvasRef = useRef(null);
  const titleRef = useRef(null);
  // const [showModal, setShowModal] = useState(false);

  const cryptoData = [
    {
      id: "bitcoin",
      symbol: "btc",
      name: "Bitcoin",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/bitcoin/info/logo.png",
      current_price: 61420.35,
      price_change_percentage_24h: 2.54,
      market_cap: 1200000000000,
      total_volume: 30000000000,
      high_24h: 61800.42,
      low_24h: 60231.87,
    },
    {
      id: "ethereum",
      symbol: "eth",
      name: "Ethereum",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
      current_price: 3280.72,
      price_change_percentage_24h: -1.23,
      market_cap: 385000000000,
      total_volume: 15000000000,
      high_24h: 3350.12,
      low_24h: 3255.33,
    },
    {
      id: "solana",
      symbol: "sol",
      name: "Solana",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png",
      current_price: 132.45,
      price_change_percentage_24h: 5.67,
      market_cap: 44000000000,
      total_volume: 2500000000,
      high_24h: 135.21,
      low_24h: 128.34,
    },
    {
      id: "cardano",
      symbol: "ada",
      name: "Cardano",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/cardano/info/logo.png",
      current_price: 1.02,
      price_change_percentage_24h: -0.45,
      market_cap: 34000000000,
      total_volume: 800000000,
      high_24h: 1.05,
      low_24h: 1.01,
    },
    {
      id: "ripple",
      symbol: "xrp",
      name: "XRP",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ripple/info/logo.png",
      current_price: 0.62,
      price_change_percentage_24h: 0.89,
      market_cap: 30000000000,
      total_volume: 1200000000,
      high_24h: 0.63,
      low_24h: 0.61,
    },
    {
      id: "polkadot",
      symbol: "dot",
      name: "Polkadot",
      image:
        "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polkadot/info/logo.png",
      current_price: 18.5,
      price_change_percentage_24h: -2.1,
      market_cap: 19000000000,
      total_volume: 600000000,
      high_24h: 19.25,
      low_24h: 18.32,
    },
  ];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeElem = document.getElementById("time");
      if (timeElem) {
        timeElem.textContent =
          now.toUTCString().match(/\d{2}:\d{2}:\d{2}/)[0] + " UTC";
      }
    };
    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    const priceInterval = setInterval(() => {
      const priceElements = document.querySelectorAll(".crypto-price");
      const changeElements = document.querySelectorAll(".price-change");

      priceElements.forEach((el, i) => {
        if (Math.random() > 0.7) {
          const currentPrice = parseFloat(
            el.textContent.replace(/[^0-9.-]/g, "")
          );
          const fluctuation = (Math.random() - 0.5) * 0.5;
          const newPrice = currentPrice * (1 + fluctuation / 100);

          el.textContent = `$${newPrice.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`;

          const currentChange = parseFloat(
            changeElements[i].textContent.replace(/[^0-9.-]/g, "")
          );
          const newChange = currentChange + fluctuation;

          if (newChange >= 0) {
            changeElements[i].className = "price-change price-up";
            changeElements[i].innerHTML = `↑ ${newChange.toFixed(2)}%`;
          } else {
            changeElements[i].className = "price-change price-down";
            changeElements[i].innerHTML = `↓ ${Math.abs(newChange).toFixed(
              2
            )}%`;
          }
        }
      });
    }, 3000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(priceInterval);
    };
  }, []);

  useEffect(() => {
    const toggle = document.getElementById("hki_mobile_nav_toggle");
    const nav = document.querySelector(".hki_nav");
    toggle.addEventListener("click", () => {
      nav.classList.toggle("hki_mobile_open");
    });

    const title = titleRef.current;
    const text = "DeFi Future Reality";
    const chars = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";
    let iteration = 0;
    const interval = setInterval(() => {
      title.innerText = text
        .split("")
        .map((letter, index) => {
          if (index < iteration) return text[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1 / 3;
    }, 40);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particles = [],
      mouse = { x: null, y: null };
    const particleCount = Math.floor(window.innerWidth / 30);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    class Particle {
      constructor(x, y, dirX, dirY, size, color) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.size = size;
        this.color = color;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.dirX = -this.dirX;
        if (this.y > canvas.height || this.y < 0) this.dirY = -this.dirY;
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x += this.dirX + dx * 0.05;
          this.y += this.dirY + dy * 0.05;
        } else {
          this.x += this.dirX;
          this.y += this.dirY;
        }
        this.draw();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const size = Math.random() * 2 + 1;
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const dirX = Math.random() * 0.4 - 0.2;
        const dirY = Math.random() * 0.4 - 0.2;
        particles.push(
          new Particle(x, y, dirX, dirY, size, "rgba(79, 70, 229, 0.8)")
        );
      }
    };

    const connectParticles = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.strokeStyle = `rgba(168, 85, 247, ${1 - dist / 120})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => p.update());
      connectParticles();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });
    initParticles();
    animate();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("hki_is_visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document
      .querySelectorAll(".hki_animate_on_scroll")
      .forEach((el) => observer.observe(el));
  }, []);

  return (
    <div id="hki_page_wrapper">
      <header id="hki_header">
        <div className="hki_logo">CryptoFI</div>
        <nav className="hki_nav">
          <Link to="/blockchainExplorer">
            <a href="#">Contract</a>
          </Link>
          <Link to="/cryptoAI">
            {" "}
            <a href="#">AI</a>
          </Link>
          <Link to="/auth">
            <a href="#" className="hki_cta_button">
              Get Started
            </a>
          </Link>
        </nav>
        <button id="hki_mobile_nav_toggle">
        <Link to="/auth">
          Get Started
          </Link>
        </button>
        
      </header>

      <main id="hki_main_content">
        <section id="hki_hero">
          <canvas id="hki_neural_canvas" ref={canvasRef}></canvas>
          <div className="hki_hero_content">
            <h1 id="hki_hero_title" ref={titleRef}></h1>
            <p className="hki_hero_subtitle">
              Unlock the future of finance — Trade, Earn and grow your crypto
              assets securely. 🌍 Trusted by users worldwide | 🔒 Safe & Secure
              | 🚀 Fast Transactions
            </p>
            <div className="RoadMap">
              <Link to="/cryptoFiRoadmap">
                <a href="wwww">👉 Road Map</a>
              </Link>
            </div>
          </div>
        </section>

        <section className="tradeee">
          <TradingDashboard />
        </section>

        <section>
          <Hero />
        </section>

        <section id="hki_features" className="hki_section">
          <div className="hki_bento_grid">
            <div className="hki_feature_card hki_animate_on_scroll">
              <h3>CryptoFi Grade Security 🌎</h3>
              <p>
                Our foundational model understands context, our assets are
                protected with advanced encryption and multi-factor
                authentication.
              </p>
            </div>
            <div className="hki_feature_card hki_animate_on_scroll">
              <h3>Fast Transactions ✅</h3>
              <p>
                On our platform you will enjoy lightning-fast deposits,
                withdrawals, and transfers.
              </p>
            </div>
            <div className="hki_feature_card hki_animate_on_scroll hki_large_card">
              <h3>Earn with Us 💲</h3>
              <p>
                By integrating our AI's you will be able to Stake and earn
                rewards on your crypto holdings, as we have the most powerful
                and advance Artificial Intelligence features.
              </p>
            </div>
          </div>
        </section>

        <section id="hki_demo" className="hki_section">
          <h2 className="hki_section_title hki_animate_on_scroll">
            Community & Mission
          </h2>
          <div className="hki_demo_terminal hki_animate_on_scroll">
            <div id="hki_demo_output">
              <p className="hki_ai_response">
                Building a global crypto platform with a mission to make
                blockchain technology accessible, trustworthy & rewarding for
                everyone with our Networks:| ARB | ETH | CELO | USDT | + More
                <span className="blinker">_</span>
              </p>
            </div>
            <form id="hki_demo_form">
              <button>CryptoFi 🚀</button>
            </form>
          </div>
        </section>

        <section id="hki_cta" className="hki_section">
          <div className="hki_cta_content hki_animate_on_scroll">
            <h2>Unleash True Autonomy</h2>
            <p>
              Move beyond automation. Start trading with intelligence today.
            </p>
          </div>
        </section>
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>

        <div className="dashboard">
          <header>
            <h1>CryptoFi Market</h1>
            <div className="time" id="time">
              00:00:00 UTC
            </div>
          </header>

          <div className="crypto-grid">
            {cryptoData.map((crypto) => {
              const isUp = crypto.price_change_percentage_24h >= 0;
              return (
                <div className="crypto-card" key={crypto.id}>
                  <div className="crypto-header">
                    <img
                      src={crypto.image}
                      alt={crypto.name}
                      className="crypto-logo"
                    />
                    <h3 className="crypto-name">
                      {crypto.name}{" "}
                      <span className="crypto-symbol">
                        {crypto.symbol.toUpperCase()}
                      </span>
                    </h3>
                  </div>
                  <div className="crypto-price">
                    $
                    {crypto.current_price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                  <span
                    className={`price-change ${
                      isUp ? "price-up" : "price-down"
                    }`}
                  >
                    {isUp ? "↑" : "↓"}{" "}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                  <div className="crypto-stats">
                    <div className="stat">
                      <div className="stat-label">Market Cap</div>
                      <div className="stat-value">
                        ${(crypto.market_cap / 1e9).toFixed(2)}B
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">24h Volume</div>
                      <div className="stat-value">
                        ${(crypto.total_volume / 1e9).toFixed(2)}B
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">24h High</div>
                      <div className="stat-value">
                        ${crypto.high_24h.toFixed(2)}
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-label">24h Low</div>
                      <div className="stat-value">
                        ${crypto.low_24h.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <section></section>
      </main>

      <footer id="hki_footer">
        <div className="hki_credit_line">
          <span>📣 Call to Action</span>
          <div className="hki_footer_links">
            <a>Trust</a> AND
            <a>Reliable</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
