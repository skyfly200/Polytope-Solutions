import { expect } from "chai";
import { shallowMount } from "@vue/test-utils";
import Footer from "@/components/Footer.vue";

describe("Footer.vue", () => {
  it("renders copyright name & date", () => {
    const wrapper = shallowMount(Footer);
    expect(wrapper.text()).to.include(
      "Skyler Fly-Wilson " + new Date().getFullYear());
  });
});
