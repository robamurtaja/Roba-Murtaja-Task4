document.addEventListener("DOMContentLoaded", function () {
  const steps = Array.from(document.querySelectorAll(".splash-step"));
  if (!steps.length) return;

  let current = 0;
  const STEP_DURATION = 900; 

  function showStep(index) {
    steps.forEach(step => step.classList.remove("active"));
    steps[index].classList.add("active");
  }

  function goNext() {
    current++;

    if (current >= steps.length) {
      localStorage.setItem("seenSplash", "yes");
      window.location.href = "onboarding.html";
      return;
    }

    showStep(current);
    setTimeout(goNext, STEP_DURATION);
  }

  showStep(current);
  setTimeout(goNext, STEP_DURATION);
});
