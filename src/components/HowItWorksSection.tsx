import { motion } from "framer-motion";
import { Calendar, Brain, Bell } from "lucide-react";

const steps = [
  {
    icon: Calendar,
    step: "01",
    title: "Input Event Data",
    description: "Enter the date and type of upcoming restaurant events into our intuitive platform.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Brain,
    step: "02",
    title: "AI Prediction",
    description: "Our advanced AI analyzes historical patterns and predicts expected food waste amounts.",
    color: "bg-accent/20 text-accent",
  },
  {
    icon: Bell,
    step: "03",
    title: "Smart Alerts",
    description: "Receive notifications 2 days and 1 day before events with actionable insights.",
    color: "bg-eco-leaf/20 text-eco-leaf",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-4">
            Simple Process
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How EcoEats Works
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Three simple steps to start reducing food waste and optimizing your restaurant operations.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative group"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[60%] w-[80%] h-px bg-gradient-to-r from-border via-primary/30 to-border" />
              )}

              <div className="glass-card rounded-2xl p-8 hover:shadow-elevated transition-all duration-500 h-full">
                {/* Step Number */}
                <div className="absolute -top-4 right-6 font-display text-6xl font-bold text-primary/10">
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-8 h-8" />
                </div>

                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
