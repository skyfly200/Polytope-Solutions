import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Landing from "@/components/Landing.vue";

describe("Landing.vue", () => {
  it("renders brand name", () => {
    const wrapper = shallowMount(Landing);
    expect(wrapper.text()).to.include("Polytope Solutions");
  });

  it("renders brand phrase", () => {
    const wrapper = shallowMount(Landing);
    expect(wrapper.text()).to.include("Gain Higher Perspectives");
  });
});
