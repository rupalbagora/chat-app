export const scrollToBottom = (ref, smooth = false) => {
  ref.current?.scrollIntoView({
    behavior: smooth ? "smooth" : "auto",
    block: "end",
  });
};
