import { motion } from "framer-motion";
import { Trash2, DollarSign, BarChart3, Globe } from "lucide-react";

const benefits = [
  {
    icon: Trash2,
    title: "Reduce Food Waste",
    description: "Cut down on unnecessary food purchases and minimize what ends up in landfills.",
    stat: "40%",
    statLabel: "Less Waste",
  },
  {
    icon: DollarSign,
    title: "Save Operational Costs",
    description: "Optimize your purchasing decisions and reduce overhead expenses significantly.",
    stat: "30%",
    statLabel: "Cost Savings",
  },
  {
    icon: BarChart3,
    title: "Optimize Inventory",
    description: "Better stock management through intelligent predictions and real-time insights.",
    stat: "2x",
    statLabel: "Efficiency",
  },
  {
    icon: Globe,
    title: "Environmental Impact",
    description: "Contribute to sustainability by reducing methane emissions from food waste.",
    stat: "50%",
    statLabel: "Less Emissions",
  },
];

const BenefitsSection = () => {
  return (
    <section id="benefits" className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary) / 0.1) 1px, transparent 0)`,
          backgroundSize: '48px 48px'
        }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Why EcoEats
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Benefits That Matter
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Join the movement towards sustainable food management with measurable results.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 lg:p-8 h-full hover:shadow-elevated transition-all duration-500 hover:-translate-y-1">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>

                {/* Stat */}
                <div className="mb-4">
                  <div className="font-display text-4xl font-bold text-gradient">
                    {benefit.stat}
                  </div>
                  <div className="text-sm text-muted-foreground">{benefit.statLabel}</div>
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
