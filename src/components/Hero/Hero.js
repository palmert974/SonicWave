import Instructions from "../Instructions/Instructions";
import "./Hero.scss";

function Hero() {
  return (
    <>
      <article className="article-hero">
        <div className="article-hero__div">
          <h1>Sonic Wave</h1>
        </div>
      </article>
      <Instructions />
    </>
  );
}

export default Hero;
