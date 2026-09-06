import { Component, OnInit, OnDestroy, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit, OnDestroy {

  // Navbar scroll state
  scrolled = false;
  menuOpen = false;

  // Animated counters
  counters = [
    { label: 'Grievances Resolved',  target: 1240, current: 0, suffix: '+' },
    { label: 'Colleges Onboarded',   target: 48,   current: 0, suffix: ''  },
    { label: 'Students Served',      target: 32000, current: 0, suffix: '+' },
    { label: 'Resolution Rate',      target: 94,   current: 0, suffix: '%' }
  ];

  // Accordion FAQ
  faqs = [
    { q: 'Who can submit a grievance?',            a: 'Any registered student can submit a grievance via their student dashboard after logging in.',                    open: false },
    { q: 'Do I need a token to register?',          a: 'Students register freely. Faculty and College Admins require a one-time registration token issued by the Super Admin.', open: false },
    { q: 'How does AI analysis work?',              a: 'After submission the system automatically sends the grievance to an AI microservice that predicts category, priority, detects duplicates, and performs risk assessment.', open: false },
    { q: 'How long does resolution take?',          a: 'The assigned faculty member handles the grievance. Resolution time varies but the dashboard always shows live status updates.', open: false },
    { q: 'Can I attach evidence to my grievance?',  a: 'Yes. You can attach images, PDFs, and documents (up to 10 MB each) when submitting or from the grievance detail page.', open: false }
  ];

  // Features
  features = [
    { icon: 'fas fa-robot',              title: 'AI-Powered Analysis',     desc: 'Every grievance is automatically analysed for category, priority, duplicate detection, fake-complaint filtering, and risk scoring.' },
    { icon: 'fas fa-shield-alt',         title: 'Role-Based Access',       desc: 'Four distinct roles — Student, Faculty, College Admin, Super Admin — each with scoped views and permissions.' },
    { icon: 'fas fa-file-alt',           title: 'Evidence Attachments',    desc: 'Upload images, PDFs, and documents as supporting evidence directly alongside your grievance.' },
    { icon: 'fas fa-chart-line',         title: 'Real-time Tracking',      desc: 'A live status timeline keeps students informed at every stage from submission through resolution.' },
    { icon: 'fas fa-university',         title: 'Multi-College Support',   desc: 'A single Super Admin manages multiple colleges, each with their own admin, departments, and faculty.' },
    { icon: 'fas fa-lock',               title: 'Secure & Private',        desc: 'JWT authentication, BCrypt-hashed passwords, and token-gated registration keep every account secure.' }
  ];

  // How it works steps
  steps = [
    { icon: 'fas fa-user-plus',        label: 'Register',      desc: 'Create your account. Students sign up freely; others use a token.' },
    { icon: 'fas fa-pen-alt',          label: 'Submit',        desc: 'Fill in the grievance form, attach evidence, and submit.' },
    { icon: 'fas fa-robot',            label: 'AI Reviews',    desc: 'The AI microservice analyses the grievance instantly.' },
    { icon: 'fas fa-user-tie',         label: 'Assigned',      desc: 'A faculty resolver is assigned and begins handling the issue.' },
    { icon: 'fas fa-check-circle',     label: 'Resolved',      desc: 'The faculty resolves and closes the grievance with a note.' }
  ];

  private counterStarted = false;
  private animFrames: number[] = [];

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 60;
    this.tryStartCounters();
  }

  ngOnInit(): void {
    // Slight delay so hero is visible before counters might already be in view
    setTimeout(() => this.tryStartCounters(), 400);
  }

  ngOnDestroy(): void {
    this.animFrames.forEach(id => cancelAnimationFrame(id));
  }

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }
  closeMenu(): void  { this.menuOpen = false; }

  toggleFaq(index: number): void {
    this.faqs[index].open = !this.faqs[index].open;
  }

  private tryStartCounters(): void {
    if (this.counterStarted) return;
    const el = document.getElementById('stats-section');
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      this.counterStarted = true;
      this.counters.forEach((c, i) => this.animateCounter(c, i));
    }
  }

  private animateCounter(counter: { target: number; current: number }, idx: number): void {
    const duration = 1800;
    const start    = performance.now();
    const tick = (now: number) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out-quad
      const eased    = 1 - (1 - progress) * (1 - progress);
      counter.current = Math.round(eased * counter.target);
      if (progress < 1) {
        this.animFrames[idx] = requestAnimationFrame(tick);
      }
    };
    this.animFrames[idx] = requestAnimationFrame(tick);
  }
}
