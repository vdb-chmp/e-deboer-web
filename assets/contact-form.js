document.querySelectorAll(".enquiry-form").forEach((form) => {
  const button = form.querySelector('button[type="submit"]');
  const status = form.querySelector(".form-status");
  const idleLabel = button.textContent;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    button.disabled = true;
    button.setAttribute("aria-busy", "true");
    status.textContent = "";
    delete status.dataset.state;

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Form submission failed");

      form.reset();
      status.textContent = form.dataset.success;
      status.dataset.state = "success";
    } catch {
      status.textContent = form.dataset.error;
      status.dataset.state = "error";
    } finally {
      button.disabled = false;
      button.removeAttribute("aria-busy");
      button.textContent = idleLabel;
    }
  });
});
