import { Layout } from "@/components/layout/Layout";

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden bg-muted">
        <img 
          src="/images/about-hero.png" 
          alt="MODA Studio" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">Our Story</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Creating elevated essentials for those who appreciate design, quality, and effortless confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 md:py-32 px-4 md:px-6 container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold">The MODA Philosophy</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Founded in 2023, MODA was born from a simple observation: dressing well shouldn't be complicated. 
            We noticed a gap between fast fashion and inaccessible luxury—a need for high-quality, thoughtfully 
            designed pieces that don't require overthinking.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Our approach is rooted in intentionality. We don't chase fleeting trends. Instead, we focus on 
            silhouette, fabric, and construction to create a modular wardrobe where every piece works effortlessly 
            with the rest. We believe your clothes should empower you to navigate your day with quiet confidence.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border border-foreground rounded-full flex items-center justify-center">
                <span className="font-serif text-xl font-bold">01</span>
              </div>
              <h3 className="text-xl font-semibold">Elevated Basics</h3>
              <p className="text-muted-foreground">
                We obsess over the details of simple garments to make them exceptional. The perfect drape, the right weight, the exact shade.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border border-foreground rounded-full flex items-center justify-center">
                <span className="font-serif text-xl font-bold">02</span>
              </div>
              <h3 className="text-xl font-semibold">Accessible Quality</h3>
              <p className="text-muted-foreground">
                By partnering directly with the best mills and factories, we offer premium construction without the traditional retail markup.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto border border-foreground rounded-full flex items-center justify-center">
                <span className="font-serif text-xl font-bold">03</span>
              </div>
              <h3 className="text-xl font-semibold">Considered Production</h3>
              <p className="text-muted-foreground">
                We produce in limited runs to minimize waste and ensure every garment meets our exacting standards before it reaches you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image / Text split */}
      <section className="py-20 md:py-32 container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div className="aspect-[4/5] bg-muted relative">
             <img 
              src="/images/design-details.png" 
              alt="Design details" 
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Designed in the City</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our studio operates at the intersection of urban energy and minimalist restraint. Every collection is 
              conceived as a cohesive system, tested in real life, and refined until it feels essential.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We design for the modern professional—someone who values aesthetics but doesn't have hours to spend 
              coordinating outfits. You have more important things to focus on; leave the style to us.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
