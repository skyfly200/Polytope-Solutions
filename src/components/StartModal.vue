<template lang="pug">
transition(name="start-modal")
  .start-modal(v-if="open" @mousedown.self="onOverlay" @keydown="onKeydown")
    .panel(ref="panel" role="dialog" aria-modal="true" aria-label="Get started" tabindex="-1")
      button.close(type="button" aria-label="Close" ref="close" @click="close") &times;
      StartForm
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import StartForm from "@/components/StartForm.vue";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// The /start intake form in a popup. Any plain link to /start opens it on the
// current page (see the click handler); /start itself still works as a URL.
@Component({ components: { StartForm } })
export default class StartModal extends Vue {
  open = false;
  private opener: HTMLElement | null = null;

  mounted() {
    document.addEventListener("click", this.onDocClick, true);
  }

  beforeDestroy() {
    document.removeEventListener("click", this.onDocClick, true);
    this.unlock();
  }

  onDocClick(e: MouseEvent) {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = (e.target as HTMLElement).closest("a");
    if (!a || a.target === "_blank") return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname.replace(/\/$/, "") !== "/start") return;
    // Already on the full page: let the link behave normally.
    if (this.$route.path === "/start") return;
    e.preventDefault();
    e.stopPropagation();
    this.show(a);
  }

  show(opener?: HTMLElement) {
    this.opener = opener || (document.activeElement as HTMLElement);
    this.open = true;
    document.documentElement.classList.add("modal-open");
    this.$nextTick(() => {
      const first = this.$el.querySelector("#cf-name") as HTMLElement | null;
      (first || (this.$refs.close as HTMLElement)).focus();
    });
  }

  // The send animation owns the screen while it plays; don't tear it down.
  get busy() {
    return !!this.$el.querySelector(".launch");
  }

  close() {
    if (!this.open || this.busy) return;
    this.open = false;
    this.unlock();
    const o = this.opener;
    this.opener = null;
    if (o && document.body.contains(o)) o.focus();
  }

  unlock() {
    document.documentElement.classList.remove("modal-open");
  }

  onOverlay() {
    this.close();
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      this.close();
      return;
    }
    if (e.key !== "Tab") return;
    const items = Array.from(
      (this.$refs.panel as HTMLElement).querySelectorAll(FOCUSABLE)
    ).filter(el => (el as HTMLElement).offsetParent !== null) as HTMLElement[];
    if (!items.length) {
      e.preventDefault();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || !(this.$refs.panel as HTMLElement).contains(active))) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  // Leaving the page (back button, other link) closes the popup.
  @Watch("$route")
  onRoute() {
    if (this.open) {
      this.open = false;
      this.unlock();
    }
  }
}
</script>

<style lang="sass" scoped>
.start-modal
  position: fixed
  inset: 0
  z-index: 200
  display: flex
  align-items: flex-start
  justify-content: center
  background: rgba(0, 0, 0, 0.78)
  overflow-y: auto
  overscroll-behavior: contain
  -webkit-overflow-scrolling: touch
  padding: 2rem 1rem

.panel
  position: relative
  width: 100%
  max-width: 640px
  margin: auto
  outline: none
  background: #0a0a0a
  border-radius: 14px

.close
  position: absolute
  top: 0.4rem
  right: 0.6rem
  z-index: 2
  width: 44px
  height: 44px
  font-size: 30px
  line-height: 1
  color: white
  background: transparent
  border: 0
  cursor: pointer
  &:focus-visible
    outline: 2px solid #fff
    border-radius: 8px

.start-modal-enter-active, .start-modal-leave-active
  transition: opacity 0.2s
.start-modal-enter, .start-modal-leave-to
  opacity: 0

@media (max-width: 600px)
  .start-modal
    padding: 0.5rem
</style>
