document.addEventListener("DOMContentLoaded", function () {
  const screens = Array.from(document.querySelectorAll(".onboard-screen"));

  if (!screens.length) return;

  let currentIndex = screens.findIndex(screen =>
    screen.classList.contains("active")
  );
  if (currentIndex === -1) currentIndex = 0;

  function showScreen(index) {
    screens.forEach(screen => screen.classList.remove("active"));
    screens[index].classList.add("active");
    currentIndex = index;
  }

  function finishOnboarding() {
     localStorage.setItem("seenOnboarding", "yes");
    window.location.href = "index.html";
  }

  screens.forEach((screen, index) => {
    const nextBtn = screen.querySelector(".btn-primary-wide");
    const skipBtn = screen.querySelector(".btn-secondary-wide");

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        if (index < screens.length - 1) {
          showScreen(index + 1);
        } else {
          finishOnboarding();
        }
      });
    }
    if (skipBtn) {
      skipBtn.addEventListener("click", function () {
        finishOnboarding();
      });
    }
  });
  showScreen(currentIndex);
});