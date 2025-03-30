"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Autoplay from "embla-carousel-autoplay";

interface Testimonials {
  name: string;
  role: string;
  content: string;
  image: string;
}

const testimonials: Testimonials[] = [
  {
    name: "Sarah Johnson",
    role: "Diabetes Patient",
    content:
      "This recipe generator has been a game-changer! Finding delicious and healthy meals that fit my dietary restrictions is now effortless.",
    image: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Michael Lee",
    role: "Heart Patient",
    content:
      "Managing my heart condition is easier with these heart-healthy recipes. The suggestions are practical and tasty!",
    image: "https://i.pravatar.cc/150?img=16",
  },
  {
    name: "Emily Davis",
    role: "Nutritionist",
    content:
      "I recommend this tool to my clients with dietary restrictions. It provides well-balanced meal options based on health conditions.",
    image: "https://i.pravatar.cc/150?img=17",
  },
  {
    name: "David Kim",
    role: "Vegan with Allergies",
    content:
      "As someone with multiple food allergies, I love how this generator customizes recipes based on my needs!",
    image: "https://i.pravatar.cc/150?img=18",
  },
  {
    name: "Sophia Martinez",
    role: "Cancer Survivor",
    content:
      "Eating the right food during recovery is crucial. This platform suggests meals that help me stay healthy and strong.",
    image: "https://i.pravatar.cc/150?img=19",
  },
  {
    name: "James Wilson",
    role: "Keto Diet Follower",
    content:
      "I struggle to find new keto-friendly recipes. This tool gives me plenty of great meal ideas!",
    image: "https://i.pravatar.cc/150?img=20",
  },
  {
    name: "Olivia Brown",
    role: "Gluten-Free Advocate",
    content:
      "Finally, a tool that helps me find gluten-free recipes without compromising on taste. Absolutely love it!",
    image: "https://i.pravatar.cc/150?img=21",
  },
  {
    name: "Liam Carter",
    role: "Parent of a Child with Food Sensitivities",
    content:
      "Meal planning for my child used to be stressful, but this app suggests safe and nutritious recipes for them!",
    image: "https://i.pravatar.cc/150?img=22",
  },
  {
    name: "Isabella Garcia",
    role: "Fitness Enthusiast",
    content:
      "This recipe generator helps me maintain a balanced diet while ensuring I get all the necessary nutrients for my workouts.",
    image: "https://i.pravatar.cc/150?img=23",
  },
  {
    name: "Noah Adams",
    role: "Elderly with Special Dietary Needs",
    content:
      "I need to be careful about what I eat due to my age. This platform makes meal selection easy and enjoyable.",
    image: "https://i.pravatar.cc/150?img=24",
  },
];

const TestimonialsCarousel = () => {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full mx-auto p-8"
    >
      <CarouselContent>
        {testimonials.map((testimonial: Testimonials, index: number) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <Card className="h-full">
              <CardContent className="flex flex-col justify-between h-full p-6">
                <p className="text-gray-600 mb-4">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center mt-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage
                      src={testimonial.image}
                      alt={testimonial.name}
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};

export default TestimonialsCarousel;