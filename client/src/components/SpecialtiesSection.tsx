
import React, { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import type { Specialty } from "@shared/schema";
import { 
  Brain, Heart, Users, Star, Activity, Shield, Sun, Moon, Zap, Target,
  MessageCircle, Mic, Volume2, TrendingUp, BarChart, Leaf, Flower, 
  HelpCircle, LifeBuoy, Handshake, Home, Palette, Clock, Timer,
  User, UserPlus, UserCheck, Stethoscope, TreePine, Wind, Umbrella,
  PieChart, Gauge, Sparkles, MessageSquare, Footprints, Waves,
  Mountain, Compass, Calendar, Hourglass, Gamepad2, Puzzle
} from "lucide-react";

// Mapeamento de ícones
const iconMap: Record<string, any> = {
  Brain, Heart, Users, Star, Activity, Shield, Sun, Moon, Zap, Target,
  MessageCircle, Mic, Volume2, TrendingUp, BarChart, Leaf, Flower, 
  HelpCircle, LifeBuoy, Handshake, Home, Palette, Clock, Timer,
  User, UserPlus, UserCheck, Stethoscope, TreePine, Wind, Umbrella,
  PieChart, Gauge, Sparkles, MessageSquare, Footprints, Waves,
  Mountain, Compass, Calendar, Hourglass, Gamepad2, Puzzle
};

// Função para converter hex para rgba com opacidade
const hexToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export default function SpecialtiesSection() {
  const { data: specialties = [], isLoading } = useQuery<Specialty[]>({
    queryKey: ["/api/specialties"],
  });

  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  if (isLoading || specialties.length === 0) {
    return null;
  }

  return (
    <section ref={ref} className="section-spacing bg-white">
      <div className="mobile-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Minhas Especialidades
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Áreas de atuação especializadas para cuidar da sua saúde mental
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {specialties.map((specialty, index) => {
            const IconComponent = iconMap[specialty.icon] || Brain;
            const backgroundColor = hexToRgba(specialty.iconColor, 0.1);
            const borderColor = hexToRgba(specialty.iconColor, 0.2);
            
            return (
              <motion.div
                key={specialty.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group card-aesthetic p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center border-2 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    backgroundColor: backgroundColor,
                    borderColor: borderColor
                  }}
                >
                  <IconComponent 
                    className="w-8 h-8" 
                    style={{ color: specialty.iconColor }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {specialty.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {specialty.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
