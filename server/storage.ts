/**
 * storage.ts
 * 
 * Interface de armazenamento de dados para a aplicação
 * Implementação atual: DatabaseStorage com PostgreSQL
 * Suporte completo ao painel administrativo
 */

import { type User, type InsertUser, type AdminUser, type InsertAdminUser, type SiteConfig, type InsertSiteConfig, type Testimonial, type InsertTestimonial, type FaqItem, type InsertFaqItem, type Service, type InsertService, type PhotoCarousel, type InsertPhotoCarousel, type Specialty, type InsertSpecialty } from "@shared/schema";
import { db } from "./db";
import { users, adminUsers, siteConfig, testimonials, faqItems, services, photoCarousel, specialties } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

// Interface comum para operações de armazenamento
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Admin methods
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Site config methods
  getSiteConfig(key: string): Promise<SiteConfig | undefined>;
  setSiteConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  getAllSiteConfigs(): Promise<SiteConfig[]>;
  deleteSiteConfig(key: string): Promise<void>;

  // Testimonials methods
  getAllTestimonials(): Promise<Testimonial[]>;
  getActiveTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  // FAQ methods
  getAllFaqItems(): Promise<FaqItem[]>;
  getActiveFaqItems(): Promise<FaqItem[]>;
  createFaqItem(faq: InsertFaqItem): Promise<FaqItem>;
  updateFaqItem(id: number, faq: Partial<InsertFaqItem>): Promise<FaqItem>;
  deleteFaqItem(id: number): Promise<void>;

  // Services methods
  getAllServices(): Promise<Service[]>;
  getActiveServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: number): Promise<void>;

  // Photo Carousel methods
  getActivePhotoCarousel(): Promise<PhotoCarousel[]>;
  getAllPhotoCarousel(): Promise<PhotoCarousel[]>;
  createPhotoCarousel(data: InsertPhotoCarousel): Promise<PhotoCarousel>;
  updatePhotoCarousel(id: number, data: Partial<InsertPhotoCarousel>): Promise<PhotoCarousel>;
  deletePhotoCarousel(id: number): Promise<void>;

  // Specialties methods
  getAllSpecialties(): Promise<Specialty[]>;
  getActiveSpecialties(): Promise<Specialty[]>;
  createSpecialty(data: InsertSpecialty): Promise<Specialty>;
  updateSpecialty(id: number, data: Partial<InsertSpecialty>): Promise<Specialty>;
  deleteSpecialty(id: number): Promise<void>;
}

// Implementação com banco de dados PostgreSQL
export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Admin methods
  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return admin || undefined;
  }

  async createAdminUser(insertAdminUser: InsertAdminUser): Promise<AdminUser> {
    const [admin] = await db.insert(adminUsers).values(insertAdminUser).returning();
    return admin;
  }

  // Site config methods
  async getSiteConfig(key: string): Promise<SiteConfig | undefined> {
    const [config] = await db.select().from(siteConfig).where(eq(siteConfig.key, key));
    return config || undefined;
  }

  async setSiteConfig(config: InsertSiteConfig): Promise<SiteConfig> {
    const existing = await this.getSiteConfig(config.key);
    if (existing) {
      const [updated] = await db
        .update(siteConfig)
        .set({ value: config.value, updatedAt: new Date() })
        .where(eq(siteConfig.key, config.key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siteConfig).values(config).returning();
      return created;
    }
  }

  async getAllSiteConfigs(): Promise<SiteConfig[]> {
    return await db.select().from(siteConfig);
  }

  async deleteSiteConfig(key: string): Promise<void> {
    await db.delete(siteConfig).where(eq(siteConfig.key, key));
  }

  // Testimonials methods
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).orderBy(asc(testimonials.order));
  }

  async getActiveTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isActive, true)).orderBy(asc(testimonials.order));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [created] = await db.insert(testimonials).values(testimonial).returning();
    return created;
  }

  async updateTestimonial(id: number, testimonial: Partial<InsertTestimonial>): Promise<Testimonial> {
    const [updated] = await db
      .update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    return updated;
  }

  async deleteTestimonial(id: number): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  // FAQ methods
  async getAllFaqItems(): Promise<FaqItem[]> {
    return await db.select().from(faqItems).orderBy(asc(faqItems.order));
  }

  async getActiveFaqItems(): Promise<FaqItem[]> {
    return await db.select().from(faqItems).where(eq(faqItems.isActive, true)).orderBy(asc(faqItems.order));
  }

  async createFaqItem(faq: InsertFaqItem): Promise<FaqItem> {
    const [created] = await db.insert(faqItems).values(faq).returning();
    return created;
  }

  async updateFaqItem(id: number, faq: Partial<InsertFaqItem>): Promise<FaqItem> {
    const [updated] = await db
      .update(faqItems)
      .set(faq)
      .where(eq(faqItems.id, id))
      .returning();
    return updated;
  }

  async deleteFaqItem(id: number): Promise<void> {
    await db.delete(faqItems).where(eq(faqItems.id, id));
  }

  // Services methods
  async getAllServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.order));
  }

  async getActiveServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.order));
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: number, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: number): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  // Photo Carousel methods
  async getActivePhotoCarousel(): Promise<PhotoCarousel[]> {
    return await db.select().from(photoCarousel).where(eq(photoCarousel.isActive, true)).orderBy(asc(photoCarousel.order));
  }

  async getAllPhotoCarousel(): Promise<PhotoCarousel[]> {
    return await db.select().from(photoCarousel).orderBy(asc(photoCarousel.order));
  }

  async createPhotoCarousel(data: InsertPhotoCarousel): Promise<PhotoCarousel> {
    const [result] = await db.insert(photoCarousel).values(data).returning();
    return result;
  }

  async updatePhotoCarousel(id: number, data: Partial<InsertPhotoCarousel>): Promise<PhotoCarousel> {
    const [result] = await db.update(photoCarousel).set(data).where(eq(photoCarousel.id, id)).returning();
    return result;
  }

  async deletePhotoCarousel(id: number): Promise<void> {
    await db.delete(photoCarousel).where(eq(photoCarousel.id, id));
  }

  // Specialties methods
  async getAllSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties).orderBy(asc(specialties.order));
  }

  async getActiveSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties).where(eq(specialties.isActive, true)).orderBy(asc(specialties.order));
  }

  async createSpecialty(data: InsertSpecialty): Promise<Specialty> {
    const [specialty] = await db.insert(specialties).values(data).returning();
    return specialty;
  }

  async updateSpecialty(id: number, data: Partial<InsertSpecialty>): Promise<Specialty> {
    const [specialty] = await db
      .update(specialties)
      .set(data)
      .where(eq(specialties.id, id))
      .returning();
    return specialty;
  }

  async deleteSpecialty(id: number): Promise<void> {
    await db.delete(specialties).where(eq(specialties.id, id));
  }
}

export const storage = new DatabaseStorage();