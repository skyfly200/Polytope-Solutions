<template lang="pug">
//- The letter as printed on the paper: shared by the flat sheet and both folds.
mixin letter()
  .face
    .lh
      .lh-mark
      .lh-text
        .lh-co Polytope Solutions
        .lh-title New project request
    .grid
      .blk(v-for="b in blocks" :key="b.key" :data-key="b.key" :class="{ wide: b.wide, pending: !blocksReady }")
        .bl {{ b.label }}
        .bv {{ b.value }}
    .lf polytopesolutions.com · sent securely
section#contact-form.contact-card
  .card(v-if="!sent" :class="{ 'is-sending': cardHidden }" :aria-hidden="cardHidden ? 'true' : null")
    .call-to-action
      i.fas.fa-rocket.rocket(aria-hidden="true")
      h2.header Start a project with us
      p.intro Tell us a little about you and what you are working on, and we will reply within a day or two.
    form.form(novalidate @submit.prevent="sendContact")
      .field
        label(for="cf-name") Name
          span.required *
        input#cf-name(v-model="name" name="name" type="text" placeholder="John Smith" autocomplete="name" :aria-invalid="submitted && !!errors.name")
        .field-error(v-if="submitted && errors.name") {{ errors.name }}
      .field
        label(for="cf-email") Email
          span.required *
        input#cf-email(v-model="email" name="email" type="email" placeholder="name@example.com" autocomplete="email" :aria-invalid="submitted && !!errors.email")
        .field-error(v-if="submitted && errors.email") {{ errors.email }}
      .field
        label(for="cf-company") Company or organization
        input#cf-company(v-model="company" name="company" type="text" placeholder="Regolith Redistributors" autocomplete="organization")
      .field
        label(for="cf-area") What do you need help with?
          span.required *
        select#cf-area(v-model="solutionArea" name="solution_area" :aria-invalid="submitted && !!errors.solutionArea")
          option(value="" disabled) Choose a solution area
          option(v-for="a in areas" :key="a" :value="a") {{ a }}
        .field-error(v-if="submitted && errors.solutionArea") {{ errors.solutionArea }}
      .field
        label(for="cf-needs") Tell us about the project
          span.required *
        textarea#cf-needs(v-model="needs" name="project_description" rows="5" placeholder="What are you trying to get done, and what is in the way?" :aria-invalid="submitted && !!errors.needs")
        .field-error(v-if="submitted && errors.needs") {{ errors.needs }}
      .field
        label(for="cf-timeline") Timeline
        input#cf-timeline(v-model="timeline" name="timeline" type="text" placeholder="e.g. start next month, launch by spring")
      .field
        label(for="cf-budget") Budget
        input#cf-budget(v-model="budget" name="budget" type="text" placeholder="A rough range is fine, or leave blank")
      .field
        label(for="cf-referral") How did you hear about us?
        input#cf-referral(v-model="referral" name="referral_source" type="text" placeholder="Referral, search, social...")
      //- Honeypot: hidden from people, tempting to bots.
      .field.hp(aria-hidden="true")
        label(for="cf-website") Website
        input#cf-website(v-model="website" name="website" type="text" tabindex="-1" autocomplete="off")
      .actions
        button.btn.btn-primary(type="submit" :disabled="sending") {{ sending ? "Sending..." : "Send" }}
        button.btn.btn-ghost(type="button" :disabled="sending || isEmpty" @click="clearForm") Reset
      p.alert(v-if="alert" :class="alertType" role="status") {{ alert }}
  .launch(v-if="overlay" ref="launch" :class="['st-' + stage, { reversing }]" aria-hidden="true")
    .backdrop
    .flash(ref="flash")
    //- The sheet of paper: composed, snapshotted, then folded in half twice.
    .paperbox(v-if="paperVisible" key="paper" ref="box" :style="boxStyle")
      .sheet(v-if="stage === 'gather' || stage === 'snap'" key="sheet" ref="sheet" :class="{ holding }")
        +letter()
      .snap-frame(v-if="stage === 'gather' || stage === 'snap'" key="frame" ref="frame")
      .fold1(v-if="stage === 'fold1'" key="fold1")
        .half.top
          .face-wrap
            +letter()
        .hinge(ref="hinge")
          .front
            .face-wrap.low
              +letter()
            .shade(ref="shadeFront")
          .back
            .shade(ref="shadeBack")
      .fold2(v-if="stage === 'fold2'" key="fold2")
        .h2.left
        .h2.hinge2(ref="hinge2")
          .front
          .back
            .shade(ref="shadeBack2")
    //- Each form field becomes a chip that flies to its place on the letter.
    .chip(v-for="c in chips" :key="c.key" v-show="chipsVisible" :style="chipStyle(c)")
      .cl {{ c.label }}
      .cv {{ c.value }}
    .env-wrap(v-if="envVisible" key="env")
      .envelope(ref="envelope")
        .env-back
        .pocket(ref="pocket" :style="pocketStyle")
        .env-front-wrap
          .env-front
        .env-flap(ref="flap")
          .face.out
          .face.in
        .env-seal(ref="seal")
    .rocket-wrap(v-if="rocketVisible" key="rocket")
      svg.rocket(viewBox="0 0 60 140")
        path.flame(d="M20 100 Q30 140 40 100 Z")
        path.fin(d="M17 82 L4 112 L20 104 Z")
        path.fin(d="M43 82 L56 112 L40 104 Z")
        path.body(d="M30 4 C44 24 46 60 44 100 L16 100 C14 60 16 24 30 4 Z")
        circle.window(cx="30" cy="56" r="8")
        rect.nozzle(x="20" y="100" width="20" height="6" rx="2")
  .card.confirmation(v-if="sent")
    h2.header Thanks for reaching out!
    p.intro We sent a confirmation to your inbox and will reply within a day or two.
    .actions
      button.btn.btn-ghost(type="button" @click="sent = false") Send another request
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import axios from "axios";
import { startAreas } from "@/data/solutions";

const EMAIL_PATTERN = /.+@.+\..+/;
const START_URL = "/.netlify/functions/start";

// Timings (ms) for the send animation. The request runs alongside the first
// two steps and the fold waits for it.
const CHIP_MS = 820;
const CHIP_STAGGER_MS = 55;
const CHIP_START_MS = 200;
const SNAP_MS = 420;
const FOLD_MS = 760;
const MOVE_MS = 560;
const SLIDE_MS = 560;
const FLAP_MS = 640;
const SEAL_MS = 360;
const LOAD_MS = 1250;
const LAUNCH_MS = 1100;
const EASE = "cubic-bezier(0.5, 0, 0.2, 1)";

// The letter is laid out at a fixed size and scaled to fit the screen.
const SHEET_W = 340;
const SHEET_H = 440;
const ENV_W = 220;
const ENV_H = 140;

// idle: nothing playing. gather: fields turn into text blocks on a letter.
// snap: the letter is captured (and held until the request succeeds).
// fold1/fold2: folded in half, then in half again. insert: the quarter slides
// into an envelope and the flap seals. loading/launching: the envelope goes
// into the rocket and it leaves. A failed request reverses gather/snap.
type Stage = "idle" | "gather" | "snap" | "fold1" | "fold2" | "insert" | "loading" | "launching";

interface Block {
  key: string;
  label: string;
  value: string;
  wide?: boolean;
}

interface Chip {
  key: string;
  label: string;
  value: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

const FIELD_IDS: { [key: string]: string } = {
  name: "cf-name",
  email: "cf-email",
  company: "cf-company",
  area: "cf-area",
  needs: "cf-needs",
  timeline: "cf-timeline",
  budget: "cf-budget",
  referral: "cf-referral"
};

const wait = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  !!window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

@Component({})
export default class StartForm extends Vue {
  name: string = "";
  company: string = "";
  email: string = "";
  solutionArea: string = "";
  needs: string = "";
  timeline: string = "";
  budget: string = "";
  referral: string = "";
  website: string = "";
  areas: string[] = startAreas;
  // Errors are only shown once the visitor has tried to send.
  submitted: boolean = false;
  sending: boolean = false;
  sent: boolean = false;
  alert: string = "";
  alertType: string = "info";

  // Send animation state.
  stage: Stage = "idle";
  reversing: boolean = false;
  cardHidden: boolean = false;
  chips: Chip[] = [];
  chipsVisible: boolean = true;
  blocksReady: boolean = false;
  holding: boolean = false;
  boxScale: number = 1;
  pocket: { left: number; top: number; width: number; height: number } = { left: 0, top: 0, width: 0, height: 0 };
  private anims: Animation[] = [];
  private chipAnims: Animation[] = [];
  private alive: boolean = true;

  beforeDestroy(): void {
    this.alive = false;
    this.cancelAnims();
  }

  get overlay(): boolean {
    return this.stage !== "idle";
  }

  get paperVisible(): boolean {
    return ["gather", "snap", "fold1", "fold2"].indexOf(this.stage) !== -1;
  }

  get envVisible(): boolean {
    return ["insert", "loading", "launching"].indexOf(this.stage) !== -1;
  }

  get rocketVisible(): boolean {
    return this.stage === "loading" || this.stage === "launching";
  }

  get boxStyle(): { [key: string]: string } {
    return { "--k": String(this.boxScale) };
  }

  get pocketStyle(): { [key: string]: string } {
    const p = this.pocket;
    return { left: p.left + "px", top: p.top + "px", width: p.width + "px", height: p.height + "px" };
  }

  // The filled-in fields, in the order they appear on the letter.
  get blocks(): Block[] {
    const list: Block[] = [
      { key: "name", label: "Name", value: this.name.trim() },
      { key: "email", label: "Email", value: this.email.trim() },
      { key: "company", label: "Company", value: this.company.trim() },
      { key: "area", label: "Needs help with", value: this.solutionArea },
      { key: "needs", label: "Project", value: this.needs.trim(), wide: true },
      { key: "timeline", label: "Timeline", value: this.timeline.trim() },
      { key: "budget", label: "Budget", value: this.budget.trim() },
      { key: "referral", label: "Heard about us via", value: this.referral.trim() }
    ];
    return list.filter(b => !!b.value);
  }

  get errors(): { name?: string; email?: string; needs?: string; solutionArea?: string } {
    const errors: { name?: string; email?: string; needs?: string; solutionArea?: string } = {};
    if (!this.name.trim()) errors.name = "Name is required";
    if (!this.email.trim()) {
      errors.email = "Email is required";
    } else if (!EMAIL_PATTERN.test(this.email.trim())) {
      errors.email = "Email must be valid";
    }
    if (!this.solutionArea) errors.solutionArea = "Please choose an area";
    if (!this.needs.trim()) errors.needs = "Please tell us about the project";
    return errors;
  }

  get isEmpty(): boolean {
    return ![this.name, this.company, this.email, this.solutionArea, this.needs, this.timeline, this.budget, this.referral].some(Boolean);
  }

  postContact(): Promise<boolean> {
    return axios
      .post(START_URL, {
        name: this.name,
        email: this.email,
        company: this.company,
        solution_area: this.solutionArea,
        project_description: this.needs,
        timeline: this.timeline,
        budget: this.budget,
        referral_source: this.referral,
        website: this.website
      })
      .then(() => true)
      .catch(error => {
        console.log(error);
        return false;
      });
  }

  showSendError(): void {
    this.alert = "An error occurred while sending. Please try again or email us at webmaster@polytopesolutions.com";
    this.alertType = "error";
  }

  async sendContact(): Promise<void> {
    if (this.sending) return;
    this.submitted = true;
    if (Object.keys(this.errors).length > 0) {
      this.alert = "Please fill in the highlighted fields.";
      this.alertType = "warning";
      return;
    }
    this.sending = true;
    this.alert = "";

    // Reduced motion: no staging, just send and show the confirmation.
    if (prefersReducedMotion()) {
      const ok = await this.postContact();
      if (ok) {
        this.sent = true;
        this.clearForm();
      } else {
        this.showSendError();
      }
      this.sending = false;
      return;
    }

    // Capture where every filled-in field sits, then start the request. The
    // animation plays while it is in flight.
    this.captureChips();
    const request = this.postContact();
    const ok = await this.composeLetter(request);
    if (!this.alive) return;

    if (!ok) {
      // Reverse: the text blocks fly back into their fields and the error shows.
      await this.reverseLetter();
      if (!this.alive) return;
      this.showSendError();
      this.sending = false;
      return;
    }

    await this.foldLetter();
    await this.sealEnvelope();
    if (!this.alive) return;

    this.stage = "loading";
    await wait(LOAD_MS);
    this.stage = "launching";
    await wait(LAUNCH_MS);
    if (!this.alive) return;

    this.sent = true;
    this.clearForm();
    this.resetAnimation();
    this.sending = false;
  }

  // ---- Send animation steps ------------------------------------------------

  chipStyle(c: Chip): { [key: string]: string } {
    return { left: c.left + "px", top: c.top + "px", width: c.width + "px", height: c.height + "px" };
  }

  private captureChips(): void {
    const chips: Chip[] = [];
    this.blocks.forEach(b => {
      const input = this.$el.querySelector("#" + FIELD_IDS[b.key]);
      const field = input && input.closest(".field");
      if (!field) return;
      const r = field.getBoundingClientRect();
      chips.push({ key: b.key, label: b.label, value: b.value, left: r.left, top: r.top, width: r.width, height: r.height });
    });
    this.chips = chips;
  }

  private animate(el: Element | null, keyframes: Keyframe[], options: KeyframeAnimationOptions): Animation | null {
    if (!el || !(el as HTMLElement).animate) return null;
    const anim = (el as HTMLElement).animate(keyframes, { fill: "both", ...options });
    this.anims.push(anim);
    return anim;
  }

  private done(anim: Animation | null): Promise<void> {
    return anim ? anim.finished.then(() => undefined, () => undefined) : Promise.resolve();
  }

  private cancelAnims(): void {
    this.anims.concat(this.chipAnims).forEach(a => {
      try {
        a.cancel();
      } catch (e) {
        // already gone
      }
    });
    this.anims = [];
    this.chipAnims = [];
  }

  private resetAnimation(): void {
    this.cancelAnims();
    this.stage = "idle";
    this.reversing = false;
    this.cardHidden = false;
    this.chips = [];
    this.chipsVisible = true;
    this.blocksReady = false;
    this.holding = false;
  }

  // Steps 1 and 2: the fields squash into text blocks that fly into place on a
  // sheet of paper, then the sheet is captured as a snapshot.
  private async composeLetter(request: Promise<boolean>): Promise<boolean> {
    let settled = false;
    request.then(() => (settled = true));

    this.boxScale = Math.max(0.45, Math.min(1, (window.innerHeight * 0.8) / SHEET_H, (window.innerWidth - 32) / SHEET_W));
    this.blocksReady = false;
    this.chipsVisible = true;
    this.cardHidden = true;
    this.stage = "gather";
    await this.$nextTick();

    const launch = this.$refs.launch as HTMLElement;
    const sheet = this.$refs.sheet as HTMLElement;
    const k = this.boxScale;

    // Measure where each block will sit before anything moves.
    const chipEls = Array.prototype.slice.call(launch.querySelectorAll(".chip")) as HTMLElement[];
    const plans = this.chips.map((c, i) => {
      const block = sheet.querySelector('.blk[data-key="' + c.key + '"]') as HTMLElement;
      const r = block.getBoundingClientRect();
      const fs = (sel: string): number => parseFloat(getComputedStyle(block.querySelector(sel) as Element).fontSize) * k;
      return { el: chipEls[i], c, r, labelSize: fs(".bl"), valueSize: fs(".bv") };
    });

    this.animate(
      sheet,
      [
        { opacity: 0, transform: "perspective(1200px) rotateX(30deg) translateY(60px) scale(0.94)" },
        { opacity: 1, transform: "perspective(1200px) rotateX(0deg) translateY(0) scale(1)" }
      ],
      { duration: 560, delay: 380, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
    );

    const ps: Promise<void>[] = [];
    plans.forEach((p, i) => {
      if (!p.el) return;
      const c = p.c;
      const t = { left: p.r.left + "px", top: p.r.top + "px", width: p.r.width + "px", height: p.r.height + "px" };
      const s = { left: c.left + "px", top: c.top + "px", width: c.width + "px", height: c.height + "px" };
      const timing = { duration: CHIP_MS, delay: CHIP_START_MS + i * CHIP_STAGGER_MS, easing: EASE };
      // Squash flat first, then lift, tilt and glide to the letter.
      const chipAnim = this.animate(
        p.el,
        [
          { ...s, backgroundColor: "rgba(247, 242, 231, 0)", transform: "perspective(900px) rotateX(0deg) scale(1, 1)", offset: 0 },
          { ...s, backgroundColor: "rgba(247, 242, 231, 0)", transform: "perspective(900px) rotateX(0deg) scale(1.03, 0.42)", offset: 0.28 },
          { transform: "perspective(900px) rotateX(32deg) scale(1, 1)", offset: 0.68 },
          { ...t, backgroundColor: "rgba(247, 242, 231, 1)", transform: "perspective(900px) rotateX(0deg) scale(1, 1)", offset: 1 }
        ],
        timing
      );
      const label = this.animate(
        p.el.querySelector(".cl"),
        [
          { fontSize: "16px", color: "rgba(255, 255, 255, 0.9)" },
          { fontSize: p.labelSize + "px", color: "#a35f00" }
        ],
        timing
      );
      const value = this.animate(
        p.el.querySelector(".cv"),
        [
          { fontSize: "16px", color: "#ffffff", backgroundColor: "rgba(0,0,0,0.45)", borderColor: "rgba(255,255,255,0.22)", borderRadius: "8px", padding: "12px 14px" },
          { fontSize: p.valueSize + "px", color: "#1d1b16", backgroundColor: "rgba(0,0,0,0)", borderColor: "rgba(255,255,255,0)", borderRadius: "0px", padding: "0px 0px" }
        ],
        timing
      );
      const gap = this.animate(p.el, [{ gap: "5.6px" }, { gap: 3 * k + "px" }], timing);
      [chipAnim, label, value, gap].forEach(a => {
        if (a) {
          this.chipAnims.push(a);
          ps.push(this.done(a));
        }
      });
    });
    await Promise.all(ps);
    if (!this.alive) return false;

    // Swap the flying chips for the real printed blocks.
    this.blocksReady = true;
    this.chipsVisible = false;

    // Snapshot: viewfinder corners, a flash and a little pop.
    this.stage = "snap";
    const frame = this.$refs.frame as HTMLElement;
    const flash = this.$refs.flash as HTMLElement;
    const snap = [
      this.animate(
        frame,
        [
          { opacity: 0, transform: "scale(1.14)" },
          { opacity: 1, transform: "scale(1)", offset: 0.35 },
          { opacity: 1, transform: "scale(1)", offset: 0.7 },
          { opacity: 0, transform: "scale(1)" }
        ],
        { duration: SNAP_MS + 200 }
      ),
      this.animate(flash, [{ opacity: 0 }, { opacity: 0.85, offset: 0.2 }, { opacity: 0 }], { duration: SNAP_MS, delay: 120 }),
      this.animate(sheet, [{ transform: "scale(1)" }, { transform: "scale(1.04)", offset: 0.25 }, { transform: "scale(1)" }], { duration: SNAP_MS, delay: 120 })
    ];
    await Promise.all(snap.map(a => this.done(a)));
    if (!this.alive) return false;

    // Hold the snapshot until the request comes back.
    if (!settled) this.holding = true;
    const ok = await request;
    this.holding = false;
    return ok;
  }

  // The request failed: send the text blocks back to their fields.
  private async reverseLetter(): Promise<void> {
    this.reversing = true;
    this.cardHidden = false;
    this.blocksReady = false;
    this.chipsVisible = true;
    await this.$nextTick();
    const sheet = this.$refs.sheet as HTMLElement;
    const fade = this.animate(
      sheet,
      [{ opacity: 1, transform: "perspective(1200px) rotateX(0deg) translateY(0)" }, { opacity: 0, transform: "perspective(1200px) rotateX(30deg) translateY(60px)" }],
      { duration: 560, delay: 150, easing: "ease-in" }
    );
    this.chipAnims.forEach(a => a.reverse());
    await Promise.all(this.chipAnims.map(a => this.done(a)).concat(this.done(fade)));
    this.resetAnimation();
  }

  // Step 3: fold the snapshot in half, then in half again.
  private async foldLetter(): Promise<void> {
    const k = this.boxScale;
    this.stage = "fold1";
    await this.$nextTick();
    const box = this.$refs.box as HTMLElement;
    const timing = { duration: FOLD_MS, easing: "cubic-bezier(0.45, 0, 0.25, 1)" };
    const first = [
      this.animate(this.$refs.hinge as HTMLElement, [{ transform: "rotateX(0deg)" }, { transform: "rotateX(180deg)" }], timing),
      this.animate(this.$refs.shadeFront as HTMLElement, [{ opacity: 0 }, { opacity: 0.6, offset: 0.5 }, { opacity: 0.6 }], timing),
      this.animate(this.$refs.shadeBack as HTMLElement, [{ opacity: 0.65 }, { opacity: 0 }], timing),
      // Recentre the folded stack as it shortens.
      this.animate(box, [{ translate: "0px 0px" }, { translate: "0px " + (SHEET_H / 4) * k + "px" }], timing)
    ];
    await Promise.all(first.map(a => this.done(a)));
    if (!this.alive) return;

    this.stage = "fold2";
    await this.$nextTick();
    const second = [
      this.animate(this.$refs.hinge2 as HTMLElement, [{ transform: "rotateY(0deg)" }, { transform: "rotateY(-180deg)" }], timing),
      this.animate(this.$refs.shadeBack2 as HTMLElement, [{ opacity: 0.65 }, { opacity: 0 }], timing),
      this.animate(box, [{ translate: "0px " + (SHEET_H / 4) * k + "px" }, { translate: (SHEET_W / 4) * k + "px " + (SHEET_H / 4) * k + "px" }], timing)
    ];
    await Promise.all(second.map(a => this.done(a)));
  }

  // Step 4: the folded letter slides into an envelope and the flap seals.
  private async sealEnvelope(): Promise<void> {
    if (!this.alive) return;
    const launch = this.$refs.launch as HTMLElement;
    const L = launch.getBoundingClientRect();
    const quarter = (launch.querySelector(".h2.left") as HTMLElement).getBoundingClientRect();
    // The envelope is centred where the sheet was (45% down the screen).
    const envLeft = L.left + L.width / 2 - ENV_W / 2;
    const envTop = L.top + L.height * 0.45 - ENV_H / 2;
    this.pocket = { left: quarter.left - envLeft, top: quarter.top - envTop, width: quarter.width, height: quarter.height };
    this.stage = "insert";
    await this.$nextTick();

    const envelope = this.$refs.envelope as HTMLElement;
    const pocket = this.$refs.pocket as HTMLElement;
    const flap = this.$refs.flap as HTMLElement;
    const seal = this.$refs.seal as HTMLElement;
    const p = this.pocket;
    const cx = p.left + p.width / 2;
    const cy = p.top + p.height / 2;
    // The letter turns sideways and shrinks to fit the envelope.
    const scale = Math.min(0.62, 150 / p.height);
    const hover = ENV_H / 2 - 135;

    this.animate(
      envelope,
      [
        { opacity: 0, transform: "perspective(900px) translateY(60px) rotateX(40deg)" },
        { opacity: 1, transform: "perspective(900px) translateY(0) rotateX(0deg)" }
      ],
      { duration: MOVE_MS, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
    );
    const up = this.animate(
      pocket,
      [
        { translate: "0px 0px", rotate: "0deg", scale: 1 },
        { translate: ENV_W / 2 - cx + "px " + (hover - cy) + "px", rotate: "-90deg", scale }
      ],
      { duration: MOVE_MS, easing: EASE }
    );
    await this.done(up);
    if (!this.alive) return;

    // Now it is above the envelope: tuck it behind the front pocket and lower it in.
    pocket.style.zIndex = "2";
    const slideY = ENV_H / 2 + 12 - cy;
    const down = this.animate(
      pocket,
      [
        { translate: ENV_W / 2 - cx + "px " + (hover - cy) + "px", rotate: "-90deg", scale },
        { translate: ENV_W / 2 - cx + "px " + slideY + "px", rotate: "-90deg", scale }
      ],
      { duration: SLIDE_MS, easing: "cubic-bezier(0.4, 0, 0.2, 1)" }
    );
    await this.done(down);
    if (!this.alive) return;

    // The top flap swings shut over the letter (and in front of it halfway).
    const close = this.animate(
      flap,
      [
        { transform: "rotateX(180deg)", zIndex: 0, easing: "cubic-bezier(0.4, 0, 0.6, 1)" },
        { transform: "rotateX(90deg)", zIndex: 0, offset: 0.5 },
        { transform: "rotateX(90deg)", zIndex: 7, offset: 0.5, easing: "cubic-bezier(0.4, 0, 0.6, 1)" },
        { transform: "rotateX(0deg)", zIndex: 7 }
      ],
      { duration: FLAP_MS }
    );
    await this.done(close);
    if (!this.alive) return;

    const stamp = this.animate(
      seal,
      [
        { opacity: 0, transform: "translate(-50%, -50%) scale(0)" },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1.3)", offset: 0.6 },
        { opacity: 1, transform: "translate(-50%, -50%) scale(1)" }
      ],
      { duration: SEAL_MS, easing: "ease-out" }
    );
    this.animate(envelope, [{ translate: "0px 0px" }, { translate: "0px 5px", offset: 0.4 }, { translate: "0px 0px" }], { duration: SEAL_MS });
    await this.done(stamp);
  }

  clearForm(): void {
    this.name = "";
    this.company = "";
    this.email = "";
    this.solutionArea = "";
    this.needs = "";
    this.timeline = "";
    this.budget = "";
    this.referral = "";
    this.website = "";
    this.submitted = false;
    this.alert = "";
    this.alertType = "info";
  }
}
</script>

<style lang="sass" scoped>
// Sits inside the snap-section wrapper (Home.vue), which centres it and gives
// it a full-height screen. The card is a fixed-width column so the labels and
// fields line up on every screen size.
.contact-card
  width: 100%
  max-width: 640px
  margin: 0 auto
  text-align: left
  color: white

.card
  background: rgba(255, 255, 255, 0.04)
  border: 1px solid rgba(255, 255, 255, 0.14)
  border-radius: 14px
  padding: clamp(1.25rem, 4vw, 2.5rem)
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5)

.call-to-action
  text-align: center
  margin-bottom: 1.5rem
  .rocket
    color: #ffa000
    font-size: 2.5rem
    margin-bottom: 0.5rem

// The root font is 14px (Vuetify sets it), so sizes here are in px.
.header
  font-size: clamp(24px, 3.6vw, 34px)
  font-weight: 600
  line-height: 1.2
  margin: 0 0 0.5rem

.intro
  font-size: clamp(16px, 1.3vw, 18px)
  line-height: 1.5
  color: rgba(255, 255, 255, 0.72)
  margin: 0

.form
  display: flex
  flex-direction: column
  gap: 1.1rem

.field
  display: flex
  flex-direction: column
  gap: 0.4rem
  label
    font-size: 16px
    font-weight: 500
    color: rgba(255, 255, 255, 0.9)
    .required
      color: #ffa000
      margin-left: 0.25rem
  input,
  select,
  textarea
    font: inherit
    font-size: 16px
    color: white
    background: rgba(0, 0, 0, 0.45)
    border: 1px solid rgba(255, 255, 255, 0.22)
    border-radius: 8px
    padding: 0.75rem 0.9rem
    width: 100%
    outline: none
    transition: border-color 0.2s, box-shadow 0.2s
    &::placeholder
      color: rgba(255, 255, 255, 0.4)
    &:focus
      border-color: #ffa000
      box-shadow: 0 0 0 3px rgba(255, 160, 0, 0.2)
    &[aria-invalid="true"]
      border-color: #ff6b6b
  select
    appearance: none
    cursor: pointer
    option
      color: black
  textarea
    resize: vertical
    min-height: 8rem
  .field-error
    color: #ff8a8a
    font-size: 15px

.field.hp
  position: absolute
  left: -10000px
  width: 1px
  height: 1px
  overflow: hidden

.actions
  display: flex
  flex-wrap: wrap
  gap: 0.75rem
  margin-top: 0.5rem

.btn
  font: inherit
  font-size: 16px
  font-weight: 600
  letter-spacing: 0.02em
  border-radius: 8px
  padding: 0.7rem 1.6rem
  cursor: pointer
  transition: background-color 0.2s, opacity 0.2s
  &:disabled
    opacity: 0.5
    cursor: not-allowed
  &.btn-primary
    background: #ffa000
    color: #000
    border: 1px solid #ffa000
    &:hover:not(:disabled)
      background: #ffb733
  &.btn-ghost
    background: transparent
    color: white
    border: 1px solid rgba(255, 255, 255, 0.4)
    &:hover:not(:disabled)
      background: rgba(255, 255, 255, 0.08)

.alert
  margin: 0.25rem 0 0
  padding: 0.75rem 1rem
  border-radius: 8px
  font-size: 15px
  line-height: 1.4
  &.warning
    background: rgba(255, 160, 0, 0.15)
    border: 1px solid rgba(255, 160, 0, 0.5)
  &.error
    background: rgba(255, 80, 80, 0.15)
    border: 1px solid rgba(255, 80, 80, 0.5)

.confirmation
  text-align: center
  animation: confirm-in 0.6s ease-out both
  .actions
    justify-content: center
    margin-top: 1.5rem

@media (max-width: 600px)
  .actions .btn
    flex: 1 1 100%

// ---- Send animation -------------------------------------------------------
// While the send plays, the card fades out and the overlay takes over.
.card
  transition: opacity 0.35s ease
  &.is-sending
    opacity: 0
    pointer-events: none

// Fixed overlay so the rocket can fly off the top of the viewport. It also
// swallows touches so the page cannot scroll out from under the animation.
.launch
  position: fixed
  inset: 0
  z-index: 60
  overflow: hidden
  touch-action: none

.backdrop
  position: absolute
  inset: 0
  background: radial-gradient(ellipse at 50% 45%, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.8))
  animation: fade-in 0.4s ease both
  transition: opacity 0.5s ease 0.1s

.launch.reversing .backdrop
  opacity: 0
  animation: none

.flash
  position: absolute
  inset: 0
  background: white
  opacity: 0
  z-index: 8
  pointer-events: none

// ---- The paper ------------------------------------------------------------
// The letter is laid out at 340 x 440 and scaled to fit by --k.
.paperbox
  position: absolute
  left: 50%
  top: 45%
  width: 340px
  height: 440px
  margin: -220px 0 0 -170px
  transform: scale(var(--k, 1))
  perspective: 1600px

$paper: #f7f2e7
$paper-back: linear-gradient(160deg, #ece4d0, #ddd3bb)

.face
  position: relative
  width: 340px
  height: 440px
  box-sizing: border-box
  padding: 26px 28px
  background: $paper
  color: #1d1b16
  overflow: hidden

.lh
  display: flex
  align-items: center
  gap: 10px
  padding-bottom: 12px
  border-bottom: 1px solid rgba(0, 0, 0, 0.14)
  .lh-mark
    width: 24px
    height: 24px
    flex: none
    background: #ffa000
    clip-path: polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)
  .lh-co
    font-size: 10px
    letter-spacing: 0.14em
    text-transform: uppercase
    color: #6b6454
  .lh-title
    font-size: 17px
    font-weight: 600
    line-height: 1.2

.grid
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 14px 16px
  margin-top: 16px

.blk
  min-width: 0
  &.wide
    grid-column: 1 / -1
  &.pending
    visibility: hidden
  .bl
    font-size: 10px
    font-weight: 600
    letter-spacing: 0.04em
    line-height: 1.2
    color: #a35f00
    margin-bottom: 3px
  .bv
    font-size: 13px
    line-height: 1.35
    overflow-wrap: anywhere
    display: -webkit-box
    -webkit-box-orient: vertical
    -webkit-line-clamp: 2
    overflow: hidden
  &.wide .bv
    -webkit-line-clamp: 5

.lf
  position: absolute
  left: 28px
  right: 28px
  bottom: 16px
  font-size: 9px
  letter-spacing: 0.06em
  color: #8a826f

.sheet
  position: absolute
  inset: 0
  overflow: hidden
  border-radius: 4px
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6)
  &.holding::after
    content: ""
    position: absolute
    left: 0
    right: 0
    top: -80px
    height: 80px
    background: linear-gradient(transparent, rgba(255, 160, 0, 0.3), transparent)
    animation: scan 1.3s linear infinite

// Viewfinder corners that frame the snapshot.
.snap-frame
  --c: #ffa000
  position: absolute
  inset: -14px
  opacity: 0
  pointer-events: none
  background: linear-gradient(var(--c), var(--c)) top left / 26px 3px no-repeat, linear-gradient(var(--c), var(--c)) top left / 3px 26px no-repeat, linear-gradient(var(--c), var(--c)) top right / 26px 3px no-repeat, linear-gradient(var(--c), var(--c)) top right / 3px 26px no-repeat, linear-gradient(var(--c), var(--c)) bottom left / 26px 3px no-repeat, linear-gradient(var(--c), var(--c)) bottom left / 3px 26px no-repeat, linear-gradient(var(--c), var(--c)) bottom right / 26px 3px no-repeat, linear-gradient(var(--c), var(--c)) bottom right / 3px 26px no-repeat

// First fold: the bottom half swings up and over the top half.
.fold1,
.fold2
  position: absolute
  inset: 0
  transform-style: preserve-3d

.fold1
  .half.top
    position: absolute
    left: 0
    top: 0
    width: 340px
    height: 220px
    overflow: hidden
    transform: translateZ(-1px)
    box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5)
  .face-wrap
    position: absolute
    left: 0
    top: 0
    &.low
      top: -220px
  .hinge
    position: absolute
    left: 0
    top: 220px
    width: 340px
    height: 220px
    transform-origin: 50% 0
    transform-style: preserve-3d
  .front,
  .back
    position: absolute
    inset: 0
    overflow: hidden
    backface-visibility: hidden
  .back
    transform: rotateX(180deg)
    background: $paper-back
    box-shadow: inset 0 -3px 5px -2px rgba(0, 0, 0, 0.3)

.shade
  position: absolute
  inset: 0
  opacity: 0
  pointer-events: none
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.55))

// Second fold: the right half swings over the left half.
.fold2
  .h2.left
    position: absolute
    left: 0
    top: 0
    width: 170px
    height: 220px
    background: $paper-back
    box-shadow: inset 0 -3px 5px -2px rgba(0, 0, 0, 0.3), 0 24px 50px rgba(0, 0, 0, 0.5)
    transform: translateZ(-1px)
  .hinge2
    position: absolute
    left: 170px
    top: 0
    width: 170px
    height: 220px
    transform-origin: 0 50%
    transform-style: preserve-3d
  .front,
  .back
    position: absolute
    inset: 0
    backface-visibility: hidden
    background: $paper-back
    box-shadow: inset 0 -3px 5px -2px rgba(0, 0, 0, 0.3)
  .back
    transform: rotateY(180deg)
    box-shadow: inset -3px 0 5px -2px rgba(0, 0, 0, 0.3), inset 0 -3px 5px -2px rgba(0, 0, 0, 0.3)
  .shade
    background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.55))

// ---- Field chips ----------------------------------------------------------
// Each starts as a copy of its form field and ends as a block of printed text.
.chip
  position: fixed
  z-index: 4
  box-sizing: border-box
  display: flex
  flex-direction: column
  gap: 5.6px
  overflow: hidden
  pointer-events: none
  transform-origin: 50% 50%
  will-change: transform
  .cl
    flex: none
    font-size: 16px
    font-weight: 500
    line-height: 1.2
    white-space: nowrap
    color: rgba(255, 255, 255, 0.9)
  .cv
    flex: 1
    min-height: 0
    box-sizing: border-box
    font-size: 16px
    line-height: 1.35
    padding: 12px 14px
    border: 1px solid rgba(255, 255, 255, 0.22)
    border-radius: 8px
    background: rgba(0, 0, 0, 0.45)
    color: white
    overflow: hidden
    overflow-wrap: anywhere
    white-space: pre-wrap

// ---- Envelope -------------------------------------------------------------
.env-wrap
  position: absolute
  left: 50%
  top: 45%
  width: 220px
  height: 140px
  transform: translate(-50%, -50%)
  z-index: 3

.envelope
  position: relative
  width: 220px
  height: 140px
  perspective: 800px

.env-back
  position: absolute
  inset: 0
  z-index: 1
  border-radius: 8px
  background: #c4b288
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.6)

// The letter being tucked in: starts in front of everything, then drops behind
// the front pocket (z-index 2) once it hovers above the envelope.
.pocket
  position: absolute
  z-index: 5
  background: $paper-back
  border-radius: 2px
  box-shadow: 0 1px 0 #cdc3aa, 0 2px 0 #c8bea4, 0 3px 0 #c2b89e, 0 12px 26px rgba(0, 0, 0, 0.45)

.env-front-wrap
  position: absolute
  inset: 0
  z-index: 3
  filter: drop-shadow(0 -1px 1px rgba(0, 0, 0, 0.25))
  .env-front
    position: absolute
    inset: 0
    border-radius: 8px
    background: linear-gradient(160deg, #f3ead6, #e2d6ba)
    clip-path: polygon(0 0, 50% 53%, 100% 0, 100% 100%, 0 100%)

.env-flap
  position: absolute
  left: 0
  top: 0
  width: 100%
  height: 53%
  z-index: 0
  transform-origin: 50% 0
  transform-style: preserve-3d
  transform: rotateX(180deg)
  .face
    position: absolute
    inset: 0
    width: auto
    height: auto
    padding: 0
    overflow: visible
    backface-visibility: hidden
    clip-path: polygon(0 0, 100% 0, 50% 100%)
  .out
    background: linear-gradient(180deg, #f6eedc, #e0d3b4)
  .in
    transform: rotateX(180deg)
    background: linear-gradient(0deg, #a8956a, #c4b288)

.env-seal
  position: absolute
  left: 50%
  top: 53%
  z-index: 8
  width: 30px
  height: 30px
  border-radius: 50%
  background: radial-gradient(circle at 35% 30%, #ffc04d, #ffa000 55%, #b36f00)
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.5)
  opacity: 0
  transform: translate(-50%, -50%) scale(0)

// ---- Rocket ---------------------------------------------------------------
.rocket-wrap
  position: absolute
  left: 50%
  bottom: 6vh
  width: 64px
  transform: translateX(-50%)
  transition: transform 1.1s cubic-bezier(0.55, 0, 0.85, 0.3)
  animation: rocket-in 0.5s ease-out both
  .rocket
    display: block
    width: 100%
    overflow: visible
  .body
    fill: #eef1f6
    stroke: #ffa000
    stroke-width: 2
  .fin
    fill: #ffa000
  .window
    fill: #142040
    stroke: #ffa000
    stroke-width: 2
  .nozzle
    fill: #6b7280
  .flame
    fill: #ffb733
    transform-box: fill-box
    transform-origin: 50% 0
    animation: flame 0.18s ease-in-out infinite alternate
    opacity: 0.35

// Envelope drops into the rocket's hatch.
.launch.st-loading,
.launch.st-launching
  .env-wrap
    transition: transform 0.8s cubic-bezier(0.6, 0, 0.4, 1) 0.4s, opacity 0.5s ease-in 0.7s
    transform: translate(-50%, calc(-50% + 49vh - 6vh - 80px)) scale(0.12)
    opacity: 0
  .flame
    opacity: 1

.launch.st-loading .rocket
  animation: rocket-rumble 0.12s linear 1.2s infinite

.launch.st-launching
  .rocket-wrap
    transform: translate(-50%, -130vh)
  .flame
    animation-duration: 0.07s

@keyframes fade-in
  from
    opacity: 0
  to
    opacity: 1

@keyframes scan
  from
    transform: translateY(0)
  to
    transform: translateY(560px)

@keyframes rocket-in
  from
    opacity: 0
    translate: 0 30px
  to
    opacity: 1
    translate: 0 0

@keyframes rocket-rumble
  0%, 100%
    translate: 0 0
  25%
    translate: -1px 1px
  75%
    translate: 1px -1px

@keyframes flame
  from
    transform: scaleY(0.75) scaleX(0.9)
  to
    transform: scaleY(1.25) scaleX(1.05)

@keyframes confirm-in
  from
    opacity: 0
    transform: translateY(16px)
  to
    opacity: 1
    transform: none

@media (prefers-reduced-motion: reduce)
  .card,
  .confirmation
    transition: none
    animation: none
</style>
