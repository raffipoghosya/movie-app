import { mount } from "@vue/test-utils";
import Home from "../src/views/Home.vue"; 

describe("Home.vue", () => {
  it("renders movie list", async () => {
    const wrapper = mount(Home);
    expect(wrapper.find(".movies-grid").exists()).toBe(true);
  });

  it("has search input", async () => {
    const wrapper = mount(Home);
    expect(wrapper.find(".search-input").exists()).toBe(true);
  });

  it("filters movies by search", async () => {
    const wrapper = mount(Home);
    const searchInput = wrapper.findComponent({ ref: "searchInput" });
  
    await searchInput.setValue("Inception");
    await searchInput.trigger("input");
  
    expect(searchInput.element.value).toBe("Inception");
  });
  
  
});
