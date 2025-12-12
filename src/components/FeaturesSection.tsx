import { motion } from "framer-motion";
import { 
  LineChart, 
  Calendar, 
  Bell, 
  Zap, 
  Shield, 
  Users,
  ArrowUpRight 
} from "lucide-react";

const features = [
  {
    icon: LineChart,
    title: "Predictive Analytics",
    description: "Machine learning models trained on vast datasets to forecast food waste with high accuracy.",
  },
  {
    icon: Calendar,
    title: "Event-Based Forecasting",
    description: "Factor in holidays, special events, and seasonal patterns for precise predictions.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Get timely alerts before events so you can adjust orders and prep accordingly.",
  },
  {
    icon: Zap,
    title: "Real-Time Insights",
    description: "Live dashboard with actionable recommendations to optimize your operations instantly.",
  },
  {
    icon: Shield,
    title: "Data Security",
    description: "Enterprise-grade encryption and compliance to protect your sensitive business data.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Multi-user access with role-based permissions for your entire team.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            Powerful Features
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything You Need
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Comprehensive tools to transform how your restaurant manages food waste.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="h-full p-6 lg:p-8 rounded-2xl border border-border/50 bg-card/50 hover:bg-card hover:shadow-card hover:border-primary/20 transition-all duration-500">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
